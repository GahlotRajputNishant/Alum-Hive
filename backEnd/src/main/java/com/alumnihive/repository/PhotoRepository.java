package com.alumnihive.repository;

import com.alumnihive.model.Photo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoRepository extends MongoRepository<Photo, String> {
    List<Photo> findAllByOrderByUploadedAtDesc();
    List<Photo> findByUploaderId(String uploaderId);
}
