package com.alumnihive.controller;

import com.alumnihive.model.Photo;
import com.alumnihive.model.User;
import com.alumnihive.repository.PhotoRepository;
import com.alumnihive.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/photos")
public class PhotoController {

    private final PhotoRepository photoRepository;
    private final UserRepository userRepository;

    public PhotoController(PhotoRepository photoRepository, UserRepository userRepository) {
        this.photoRepository = photoRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<List<Photo>> getAllPhotos() {
        return ResponseEntity.ok(photoRepository.findAllByOrderByUploadedAtDesc());
    }

    @PostMapping
    public ResponseEntity<?> uploadPhoto(@RequestBody PhotoRequest request) {
        if (request.getImageUrl() == null || request.getImageUrl().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Image URL is required"));
        }
        User user = getCurrentUser();
        Photo photo = new Photo(
            request.getImageUrl(),
            request.getCaption(),
            request.getCategory() != null ? request.getCategory() : "EVENT",
            user
        );
        Photo saved = photoRepository.save(photo);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePhoto(@PathVariable String id) {
        User user = getCurrentUser();
        return photoRepository.findById(id).map(photo -> {
            if ("ADMIN".equals(user.getRole()) || (photo.getUploader() != null && photo.getUploader().getId().equals(user.getId()))) {
                photoRepository.delete(photo);
                return ResponseEntity.ok(Map.of("message", "Photo deleted successfully"));
            }
            return ResponseEntity.status(403).body(Map.of("message", "Unauthorized to delete photo"));
        }).orElse(ResponseEntity.notFound().build());
    }

    public static class PhotoRequest {
        private String imageUrl;
        private String caption;
        private String category;

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public String getCaption() { return caption; }
        public void setCaption(String caption) { this.caption = caption; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
    }
}
