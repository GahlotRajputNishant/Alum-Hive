package com.alumnihive.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "likes")
@CompoundIndex(name = "reel_user_unique", def = "{'reelId': 1, 'userId': 1}", unique = true)
public class Like {

    @Id
    private String id;

    private String reelId;

    private String userId;

    public Like() {}

    public Like(String reelId, String userId) {
        this.reelId = reelId;
        this.userId = userId;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getReelId() { return reelId; }
    public void setReelId(String reelId) { this.reelId = reelId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
