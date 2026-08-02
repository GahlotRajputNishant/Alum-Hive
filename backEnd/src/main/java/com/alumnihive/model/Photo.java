package com.alumnihive.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "photos")
public class Photo {

    @Id
    private String id;

    private String imageUrl;
    private String caption;
    private String category; // "EVENT", "CAMPUS_MEMORIES", "INTERNSHIP", "WORKPLACE"

    @DBRef
    private User uploader;

    private LocalDateTime uploadedAt;

    public Photo() {}

    public Photo(String imageUrl, String caption, String category, User uploader) {
        this.imageUrl = imageUrl;
        this.caption = caption;
        this.category = category;
        this.uploader = uploader;
        this.uploadedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCaption() { return caption; }
    public void setCaption(String caption) { this.caption = caption; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public User getUploader() { return uploader; }
    public void setUploader(User uploader) { this.uploader = uploader; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
