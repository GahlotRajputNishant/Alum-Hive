package com.alumnihive.controller;

import com.alumnihive.model.Job;
import com.alumnihive.model.User;
import com.alumnihive.repository.JobRepository;
import com.alumnihive.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobController(JobRepository jobRepository, UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobRepository.findAllByOrderByPostedAtDesc());
    }

    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody JobRequest request) {
        User user = getCurrentUser();

        if (!"ALUMNI".equals(user.getRole()) && !"ADMIN".equals(user.getRole())) {
            return ResponseEntity.status(403).body(Map.of("message", "Only alumni and admins can post job opportunities"));
        }

        if (request.getTitle() == null || request.getTitle().trim().isEmpty() ||
            request.getCompany() == null || request.getCompany().trim().isEmpty() ||
            request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Title, company, and description are required"));
        }

        Job job = new Job(
            request.getTitle(),
            request.getCompany(),
            request.getLocation(),
            request.getDescription(),
            request.getSalaryRange(),
            user
        );

        Job saved = jobRepository.save(job);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable String id) {
        User user = getCurrentUser();
        return jobRepository.findById(id).map(job -> {
            if ("ADMIN".equals(user.getRole()) || (job.getPostedBy() != null && job.getPostedBy().getId().equals(user.getId()))) {
                jobRepository.delete(job);
                return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
            }
            return ResponseEntity.status(403).body(Map.of("message", "Unauthorized to delete this job"));
        }).orElse(ResponseEntity.notFound().build());
    }

    public static class JobRequest {
        private String title;
        private String company;
        private String location;
        private String description;
        private String salaryRange;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getCompany() { return company; }
        public void setCompany(String company) { this.company = company; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getSalaryRange() { return salaryRange; }
        public void setSalaryRange(String salaryRange) { this.salaryRange = salaryRange; }
    }
}
