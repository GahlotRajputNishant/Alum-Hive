package com.alumnihive.controller;

import com.alumnihive.model.Event;
import com.alumnihive.model.User;
import com.alumnihive.repository.EventRepository;
import com.alumnihive.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventController(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody EventRequest request) {
        User user = getCurrentUser();
        if (!"ALUMNI".equals(user.getRole()) && !"ADMIN".equals(user.getRole())) {
            return ResponseEntity.status(403).body(Map.of("message", "Only alumni and admins can host events"));
        }

        if (request.getTitle() == null || request.getTitle().trim().isEmpty() ||
            request.getEventDate() == null || request.getEventDate().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Event title and date are required"));
        }

        Event event = new Event(
            request.getTitle(),
            request.getDescription(),
            request.getEventDate(),
            request.getLocationOrLink(),
            request.getEventType() != null ? request.getEventType() : "WEBINAR",
            user
        );
        Event saved = eventRepository.save(event);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable String id) {
        User user = getCurrentUser();
        return eventRepository.findById(id).map(event -> {
            if ("ADMIN".equals(user.getRole()) || (event.getOrganizer() != null && event.getOrganizer().getId().equals(user.getId()))) {
                eventRepository.delete(event);
                return ResponseEntity.ok(Map.of("message", "Event deleted"));
            }
            return ResponseEntity.status(403).body(Map.of("message", "Unauthorized"));
        }).orElse(ResponseEntity.notFound().build());
    }

    public static class EventRequest {
        private String title;
        private String description;
        private String eventDate;
        private String locationOrLink;
        private String eventType;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getEventDate() { return eventDate; }
        public void setEventDate(String eventDate) { this.eventDate = eventDate; }
        public String getLocationOrLink() { return locationOrLink; }
        public void setLocationOrLink(String locationOrLink) { this.locationOrLink = locationOrLink; }
        public String getEventType() { return eventType; }
        public void setEventType(String eventType) { this.eventType = eventType; }
    }
}
