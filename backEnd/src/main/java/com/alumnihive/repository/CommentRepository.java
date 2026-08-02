package com.alumnihive.repository;

import com.alumnihive.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByReelIdOrderByCreatedAtAsc(String reelId);
    void deleteByReelId(String reelId);
}
