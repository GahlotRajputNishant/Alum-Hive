package com.alumnihive.repository;

import com.alumnihive.model.Like;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends MongoRepository<Like, String> {
    Optional<Like> findByReelIdAndUserId(String reelId, String userId);
    boolean existsByReelIdAndUserId(String reelId, String userId);
    void deleteByReelIdAndUserId(String reelId, String userId);
    void deleteByReelId(String reelId);
}
