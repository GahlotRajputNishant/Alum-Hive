package com.alumnihive.repository;

import com.alumnihive.model.Follow;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowRepository extends MongoRepository<Follow, String> {
    boolean existsByStudentIdAndAlumniId(String studentId, String alumniId);
    void deleteByStudentIdAndAlumniId(String studentId, String alumniId);
    List<Follow> findByStudentId(String studentId);
    List<Follow> findByAlumniId(String alumniId);
    long countByStudentId(String studentId);
    long countByAlumniId(String alumniId);
}
