package com.alumnihive.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "follows")
@CompoundIndex(name = "student_alumni_unique", def = "{'studentId': 1, 'alumniId': 1}", unique = true)
public class Follow {

    @Id
    private String id;

    private String studentId;
    private String alumniId;
    private LocalDateTime followedAt;

    public Follow() {}

    public Follow(String studentId, String alumniId) {
        this.studentId = studentId;
        this.alumniId = alumniId;
        this.followedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getAlumniId() { return alumniId; }
    public void setAlumniId(String alumniId) { this.alumniId = alumniId; }

    public LocalDateTime getFollowedAt() { return followedAt; }
    public void setFollowedAt(LocalDateTime followedAt) { this.followedAt = followedAt; }
}
