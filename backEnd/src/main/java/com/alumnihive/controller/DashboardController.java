package com.alumnihive.controller;

import com.alumnihive.model.Job;
import com.alumnihive.model.User;
import com.alumnihive.repository.FollowRepository;
import com.alumnihive.repository.JobRepository;
import com.alumnihive.repository.ReelRepository;
import com.alumnihive.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ReelRepository reelRepository;
    private final FollowRepository followRepository;

    public DashboardController(UserRepository userRepository, JobRepository jobRepository,
                               ReelRepository reelRepository, FollowRepository followRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.reelRepository = reelRepository;
        this.followRepository = followRepository;
    }

    private User getCurrentUser() {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        User user = getCurrentUser();
        String role = user.getRole();

        Map<String, Object> stats = new HashMap<>();
        stats.put("role", role);
        stats.put("fullName", user.getFullName());
        stats.put("userId", user.getId());

        if ("STUDENT".equals(role)) {
            long alumniCount = userRepository.countByRole("ALUMNI");
            long totalJobs = jobRepository.count();
            long totalReels = reelRepository.count();
            long followingCount = followRepository.countByStudentId(user.getId());

            stats.put("alumniCount", alumniCount);
            stats.put("totalJobs", totalJobs);
            stats.put("totalReels", totalReels);
            stats.put("followingCount", followingCount);

            List<User> alumni = userRepository.findByRole("ALUMNI");
            List<Map<String, Object>> mentorSuggestions = alumni.stream().limit(6).map(u -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", u.getId());
                m.put("fullName", u.getFullName());
                m.put("company", u.getCompany());
                m.put("jobTitle", u.getJobTitle());
                m.put("major", u.getMajor());
                m.put("graduationYear", u.getGraduationYear());
                m.put("profilePicture", u.getProfilePicture());
                m.put("bio", u.getBio());
                m.put("isFollowing", followRepository.existsByStudentIdAndAlumniId(user.getId(), u.getId()));
                return m;
            }).collect(Collectors.toList());
            stats.put("mentors", mentorSuggestions);

        } else if ("ALUMNI".equals(role)) {
            List<Job> allJobs = jobRepository.findAll();
            long jobsPostedByMe = allJobs.stream()
                    .filter(j -> j.getPostedBy() != null && j.getPostedBy().getId().equals(user.getId()))
                    .count();
            long studentCount = userRepository.countByRole("STUDENT");
            long totalReels = reelRepository.count();
            long followersCount = followRepository.countByAlumniId(user.getId());

            stats.put("jobsPostedCount", jobsPostedByMe);
            stats.put("studentsCount", studentCount);
            stats.put("totalReels", totalReels);
            stats.put("followersCount", followersCount);

            List<User> students = userRepository.findByRole("STUDENT");
            List<Map<String, Object>> studentList = students.stream().limit(6).map(u -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", u.getId());
                m.put("fullName", u.getFullName());
                m.put("major", u.getMajor());
                m.put("graduationYear", u.getGraduationYear());
                m.put("profilePicture", u.getProfilePicture());
                m.put("bio", u.getBio());
                return m;
            }).collect(Collectors.toList());
            stats.put("students", studentList);

        } else if ("ADMIN".equals(role)) {
            long totalUsers = userRepository.count();
            long studentCount = userRepository.countByRole("STUDENT");
            long alumniCount = userRepository.countByRole("ALUMNI");
            long adminCount = userRepository.countByRole("ADMIN");
            long totalJobs = jobRepository.count();
            long totalReels = reelRepository.count();

            stats.put("totalUsers", totalUsers);
            stats.put("studentsCount", studentCount);
            stats.put("alumniCount", alumniCount);
            stats.put("adminsCount", adminCount);
            stats.put("totalJobs", totalJobs);
            stats.put("totalReels", totalReels);

            List<User> recentUsers = userRepository.findAll();
            List<Map<String, Object>> usersList = recentUsers.stream().limit(10).map(u -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", u.getId());
                m.put("username", u.getUsername());
                m.put("fullName", u.getFullName());
                m.put("email", u.getEmail());
                m.put("role", u.getRole());
                return m;
            }).collect(Collectors.toList());
            stats.put("recentUsers", usersList);
        }

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/alumni")
    public ResponseEntity<List<Map<String, Object>>> getAllAlumni() {
        User currentUser = getCurrentUser();
        List<User> alumni = userRepository.findByRole("ALUMNI");

        List<Map<String, Object>> result = alumni.stream().map(u -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", u.getId());
            m.put("username", u.getUsername());
            m.put("fullName", u.getFullName());
            m.put("email", u.getEmail());
            m.put("company", u.getCompany());
            m.put("jobTitle", u.getJobTitle());
            m.put("major", u.getMajor());
            m.put("graduationYear", u.getGraduationYear());
            m.put("profilePicture", u.getProfilePicture());
            m.put("bio", u.getBio());
            m.put("isFollowing", "STUDENT".equals(currentUser.getRole()) 
                ? followRepository.existsByStudentIdAndAlumniId(currentUser.getId(), u.getId()) 
                : false);
            return m;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/students")
    public ResponseEntity<List<User>> getAllStudents() {
        return ResponseEntity.ok(userRepository.findByRole("STUDENT"));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        User currentUser = getCurrentUser();
        if (!"ADMIN".equals(currentUser.getRole())) {
            return ResponseEntity.status(403).body(Map.of("message", "Only admins can delete users"));
        }
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
