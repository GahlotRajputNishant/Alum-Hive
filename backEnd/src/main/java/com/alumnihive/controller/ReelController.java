package com.alumnihive.controller;

import com.alumnihive.model.Comment;
import com.alumnihive.model.Like;
import com.alumnihive.model.Reel;
import com.alumnihive.model.User;
import com.alumnihive.repository.CommentRepository;
import com.alumnihive.repository.LikeRepository;
import com.alumnihive.repository.ReelRepository;
import com.alumnihive.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reels")
public class ReelController {

    private final ReelRepository reelRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

    public ReelController(ReelRepository reelRepository, UserRepository userRepository,
                          LikeRepository likeRepository, CommentRepository commentRepository) {
        this.reelRepository = reelRepository;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
    }

    private User getCurrentUser() {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<List<Reel>> getAllReels() {
        return ResponseEntity.ok(reelRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping
    public ResponseEntity<?> createReel(@RequestBody ReelRequest request) {
        if (request.getVideoUrl() == null || request.getVideoUrl().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Video URL is required"));
        }
        User user = getCurrentUser();
        Reel reel = new Reel(request.getVideoUrl(), request.getCaption(), user);
        Reel saved = reelRepository.save(reel);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable String id) {
        Optional<Reel> reelOpt = reelRepository.findById(id);
        if (reelOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Reel reel = reelOpt.get();
        User user = getCurrentUser();

        Optional<Like> existingLike = likeRepository.findByReelIdAndUserId(reel.getId(), user.getId());
        boolean liked;
        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            reel.setLikesCount(Math.max(0, reel.getLikesCount() - 1));
            liked = false;
        } else {
            likeRepository.save(new Like(reel.getId(), user.getId()));
            reel.setLikesCount(reel.getLikesCount() + 1);
            liked = true;
        }
        reelRepository.save(reel);

        return ResponseEntity.ok(Map.of(
            "liked", liked,
            "likesCount", reel.getLikesCount()
        ));
    }

    @GetMapping("/{id}/liked")
    public ResponseEntity<?> checkLike(@PathVariable String id) {
        User user = getCurrentUser();
        boolean liked = likeRepository.existsByReelIdAndUserId(id, user.getId());
        return ResponseEntity.ok(Map.of("liked", liked));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable String id) {
        return ResponseEntity.ok(commentRepository.findByReelIdOrderByCreatedAtAsc(id));
    }

    @PostMapping("/{id}/comment")
    public ResponseEntity<?> addComment(@PathVariable String id, @RequestBody CommentRequest request) {
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Comment content cannot be empty"));
        }
        Optional<Reel> reelOpt = reelRepository.findById(id);
        if (reelOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Reel reel = reelOpt.get();
        User user = getCurrentUser();

        Comment comment = new Comment(request.getContent(), reel.getId(), user);
        Comment saved = commentRepository.save(comment);

        reel.setCommentsCount(reel.getCommentsCount() + 1);
        reelRepository.save(reel);

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReel(@PathVariable String id) {
        Optional<Reel> reelOpt = reelRepository.findById(id);
        if (reelOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Reel reel = reelOpt.get();
        User user = getCurrentUser();

        if (user.getRole().equals("ADMIN") || (reel.getCreator() != null && reel.getCreator().getId().equals(user.getId()))) {
            likeRepository.deleteByReelId(id);
            commentRepository.deleteByReelId(id);
            reelRepository.delete(reel);
            return ResponseEntity.ok(Map.of("message", "Reel deleted successfully"));
        } else {
            return ResponseEntity.status(403).body(Map.of("message", "You do not have permission to delete this reel"));
        }
    }

    public static class ReelRequest {
        private String videoUrl;
        private String caption;

        public String getVideoUrl() { return videoUrl; }
        public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
        public String getCaption() { return caption; }
        public void setCaption(String caption) { this.caption = caption; }
    }

    public static class CommentRequest {
        private String content;

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }
}
