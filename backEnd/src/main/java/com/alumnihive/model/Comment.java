package com.alumnihive.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "comments")
public class Comment {

    @Id
    private String id;

    private String content;

    private String reelId;

    @DBRef
    @Field("commenter")
    private User commenter;

    private LocalDateTime createdAt;

    public Comment() {}

    public Comment(String content, String reelId, User commenter) {
        this.content = content;
        this.reelId = reelId;
        this.commenter = commenter;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getReelId() { return reelId; }
    public void setReelId(String reelId) { this.reelId = reelId; }

    public User getCommenter() { return commenter; }
    public void setCommenter(User commenter) { this.commenter = commenter; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
