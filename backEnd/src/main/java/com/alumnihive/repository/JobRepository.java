package com.alumnihive.repository;

import com.alumnihive.model.Job;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {
    List<Job> findAllByOrderByPostedAtDesc();
    List<Job> findByPostedById(String postedById);
}
