package com.alumnihive.repository;

import com.alumnihive.model.Reel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReelRepository extends MongoRepository<Reel, String> {
    List<Reel> findAllByOrderByCreatedAtDesc();
    List<Reel> findByCreatorId(String creatorId);
}
