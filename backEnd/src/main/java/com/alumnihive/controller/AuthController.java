package com.alumnihive.controller;

import com.alumnihive.model.User;
import com.alumnihive.repository.UserRepository;
import com.alumnihive.security.JwtUtil;
import com.alumnihive.security.PasswordHasher;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;
    private final JwtUtil jwtUtil;

    // Temporary in-memory OTP cache for demo (email/username -> otp)
    private static final Map<String, String> otpCache = new HashMap<>();

    public AuthController(UserRepository userRepository, PasswordHasher passwordHasher, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Prevent registration as ADMIN via public registration
        if ("ADMIN".equalsIgnoreCase(request.getRole())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Admin registration is restricted."));
        }

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username is already taken"));
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is already registered"));
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordHasher.hash(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole(request.getRole().toUpperCase());
        user.setFullName(request.getFullName());
        user.setMajor(request.getMajor());
        user.setGraduationYear(request.getGraduationYear());
        user.setCompany(request.getCompany());
        user.setJobTitle(request.getJobTitle());
        user.setBio(request.getBio());

        String defaultAvatar = "https://api.dicebear.com/7.x/adventurer/svg?seed=" + request.getUsername();
        user.setProfilePicture(request.getProfilePicture() != null ? request.getProfilePicture() : defaultAvatar);

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser);
        return ResponseEntity.ok(Map.of(
            "token", token,
            "role", savedUser.getRole(),
            "username", savedUser.getUsername(),
            "fullName", savedUser.getFullName(),
            "userId", savedUser.getId()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isEmpty() || !passwordHasher.matches(request.getPassword(), userOpt.get().getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid username or password"));
        }

        User user = userOpt.get();
        String token = jwtUtil.generateToken(user);
        return ResponseEntity.ok(Map.of(
            "token", token,
            "role", user.getRole(),
            "username", user.getUsername(),
            "fullName", user.getFullName(),
            "userId", user.getId()
        ));
    }

    @PostMapping("/forgot-password/request")
    public ResponseEntity<?> requestOtp(@RequestBody Map<String, String> request) {
        String identifier = request.get("identifier"); // username or email
        if (identifier == null || identifier.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username or Email is required"));
        }

        Optional<User> userOpt = userRepository.findByUsername(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(identifier);
        }

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User with provided username/email not found"));
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(900000) + 100000);
        otpCache.put(userOpt.get().getUsername(), otp);

        return ResponseEntity.ok(Map.of(
            "message", "OTP sent successfully to " + userOpt.get().getEmail(),
            "otp", otp, // Returning generated OTP in response for instant demo testing
            "username", userOpt.get().getUsername()
        ));
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        if (username == null || otp == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username, OTP, and New Password are required"));
        }

        String cachedOtp = otpCache.get(username);
        if (cachedOtp == null || !cachedOtp.equals(otp)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired OTP code"));
        }

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();
        user.setPassword(passwordHasher.hash(newPassword));
        userRepository.save(user);

        otpCache.remove(username);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully! You can now sign in with your new password."));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }
        return ResponseEntity.ok(userOpt.get());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody User updateData) {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();
        if (updateData.getFullName() != null) user.setFullName(updateData.getFullName());
        if (updateData.getBio() != null) user.setBio(updateData.getBio());
        if (updateData.getMajor() != null) user.setMajor(updateData.getMajor());
        if (updateData.getGraduationYear() != null) user.setGraduationYear(updateData.getGraduationYear());
        if (updateData.getCompany() != null) user.setCompany(updateData.getCompany());
        if (updateData.getJobTitle() != null) user.setJobTitle(updateData.getJobTitle());
        if (updateData.getProfilePicture() != null) user.setProfilePicture(updateData.getProfilePicture());

        User updated = userRepository.save(user);
        return ResponseEntity.ok(updated);
    }

    public static class RegisterRequest {
        private String username;
        private String password;
        private String email;
        private String role;
        private String fullName;
        private String major;
        private Integer graduationYear;
        private String company;
        private String jobTitle;
        private String bio;
        private String profilePicture;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getMajor() { return major; }
        public void setMajor(String major) { this.major = major; }
        public Integer getGraduationYear() { return graduationYear; }
        public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }
        public String getCompany() { return company; }
        public void setCompany(String company) { this.company = company; }
        public String getJobTitle() { return jobTitle; }
        public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
        public String getBio() { return bio; }
        public void setBio(String bio) { this.bio = bio; }
        public String getProfilePicture() { return profilePicture; }
        public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
    }

    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
