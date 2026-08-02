package com.alumnihive.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "events")
public class Event {

    @Id
    private String id;

    private String title;
    private String description;
    private String eventDate;
    private String locationOrLink;
    private String eventType; // "WEBINAR", "MEETUP", "WORKSHOP", "Q_AND_A"

    @DBRef
    private User organizer;

    private LocalDateTime createdAt;

    public Event() {}

    public Event(String title, String description, String eventDate, String locationOrLink, String eventType, User organizer) {
        this.title = title;
        this.description = description;
        this.eventDate = eventDate;
        this.locationOrLink = locationOrLink;
        this.eventType = eventType;
        this.organizer = organizer;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

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

    public User getOrganizer() { return organizer; }
    public void setOrganizer(User organizer) { this.organizer = organizer; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
