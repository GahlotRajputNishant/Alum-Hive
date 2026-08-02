package com.alumnihive.controller;

import com.alumnihive.model.Follow;
import com.alumnihive.model.User;
import com.alumnihive.repository.FollowRepository;
import com.alumnihive.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/follow")
public class FollowController {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    public FollowController(FollowRepository followRepository, UserRepository userRepository) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @PostMapping("/{alumniId}")
    public ResponseEntity<?> followAlumni(@PathVariable String alumniId) {
        User student = getCurrentUser();
        if (!"STUDENT".equals(student.getRole())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Only students can follow alumni"));
        }
        if (!userRepository.existsById(alumniId)) {
            return ResponseEntity.notFound().build();
        }

        if (followRepository.existsByStudentIdAndAlumniId(student.getId(), alumniId)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Already following this alumni"));
        }

        Follow follow = new Follow(student.getId(), alumniId);
        followRepository.save(follow);

        return ResponseEntity.ok(Map.of("following", true, "message", "Successfully followed alumni"));
    }

    @DeleteMapping("/{alumniId}")
    public ResponseEntity<?> unfollowAlumni(@PathVariable String alumniId) {
        User student = getCurrentUser();
        followRepository.deleteByStudentIdAndAlumniId(student.getId(), alumniId);
        return ResponseEntity.ok(Map.of("following", false, "message", "Unfollowed alumni"));
    }

    @GetMapping("/following")
    public ResponseEntity<?> getFollowingList() {
        User student = getCurrentUser();
        List<Follow> follows = followRepository.findByStudentId(student.getId());
        List<String> alumniIds = follows.stream().map(Follow::getAlumniId).collect(Collectors.toList());

        List<User> alumni = userRepository.findAllById(alumniIds);
        List<Map<String, Object>> result = alumni.stream().map(u -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", u.getId());
            m.put("fullName", u.getFullName());
            m.put("company", u.getCompany());
            m.put("jobTitle", u.getJobTitle());
            m.put("profilePicture", u.getProfilePicture());
            return m;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
