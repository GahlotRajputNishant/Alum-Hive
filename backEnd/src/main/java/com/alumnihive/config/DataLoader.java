package com.alumnihive.config;

import com.alumnihive.model.*;
import com.alumnihive.repository.*;
import com.alumnihive.security.PasswordHasher;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ReelRepository reelRepository;
    private final CommentRepository commentRepository;
    private final PhotoRepository photoRepository;
    private final EventRepository eventRepository;
    private final PasswordHasher passwordHasher;

    public DataLoader(UserRepository userRepository, JobRepository jobRepository,
                      ReelRepository reelRepository, CommentRepository commentRepository,
                      PhotoRepository photoRepository, EventRepository eventRepository,
                      PasswordHasher passwordHasher) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.reelRepository = reelRepository;
        this.commentRepository = commentRepository;
        this.photoRepository = photoRepository;
        this.eventRepository = eventRepository;
        this.passwordHasher = passwordHasher;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return;
        }

        // 1. Seed Users
        User admin = new User("admin", passwordHasher.hash("admin123"), "admin@alumnihive.com", "ADMIN", "Administrator");
        admin.setBio("Hive Master System Administrator.");
        admin.setProfilePicture("https://api.dicebear.com/7.x/bottts/svg?seed=admin");
        admin = userRepository.save(admin);

        User alumni1 = new User("alumni1", passwordHasher.hash("alumni123"), "neha.patil@alumni.com", "ALUMNI", "Neha Patil");
        alumni1.setBio("Senior Software Engineer at Google. Passionate about mentoring next-gen developers and scale architecture.");
        alumni1.setMajor("Computer Science");
        alumni1.setGraduationYear(2021);
        alumni1.setCompany("Google");
        alumni1.setJobTitle("Senior Software Engineer");
        alumni1.setProfilePicture("https://api.dicebear.com/7.x/avataaars/svg?seed=Neha");
        alumni1 = userRepository.save(alumni1);

        User alumni2 = new User("alumni2", passwordHasher.hash("alumni123"), "rohan.das@alumni.com", "ALUMNI", "Rohan Das");
        alumni2.setBio("AI Researcher at Meta. Specializing in computer vision, generative AI, and multi-modal models.");
        alumni2.setMajor("Electrical Engineering");
        alumni2.setGraduationYear(2019);
        alumni2.setCompany("Meta");
        alumni2.setJobTitle("AI Researcher");
        alumni2.setProfilePicture("https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan");
        alumni2 = userRepository.save(alumni2);

        User student1 = new User("student1", passwordHasher.hash("student123"), "aarav.sharma@student.edu", "STUDENT", "Aarav Sharma");
        student1.setBio("CS Sophomore interested in Full-Stack web development and distributed systems.");
        student1.setMajor("Computer Science");
        student1.setGraduationYear(2027);
        student1.setProfilePicture("https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav");
        student1 = userRepository.save(student1);

        User student2 = new User("student2", passwordHasher.hash("student123"), "priya.sen@student.edu", "STUDENT", "Priya Sen");
        student2.setBio("Data Engineering enthusiast seeking internships. Proficient in Python, SQL, and Apache Spark.");
        student2.setMajor("Information Technology");
        student2.setGraduationYear(2026);
        student2.setProfilePicture("https://api.dicebear.com/7.x/avataaars/svg?seed=Priya");
        student2 = userRepository.save(student2);

        // 2. Seed Jobs
        Job job1 = new Job("Software Engineering Intern", "Google", "Bangalore (Hybrid)",
                "We are looking for a Software Engineering Intern to join our Core infrastructure team. You will work on scalable APIs, microservices, and gain exposure to cloud platforms.",
                "₹50,000 - ₹75,000 / month", alumni1);
        jobRepository.save(job1);

        Job job2 = new Job("AI Research Assistant", "Meta", "Remote",
                "Join our AI labs to work on training large language models and multi-modal generative pipelines. Requirements: PyTorch proficiency and transformer architectures.",
                "$4,000 - $6,000 / month", alumni2);
        jobRepository.save(job2);

        Job job3 = new Job("Associate Software Engineer", "Google", "Hyderabad",
                "Full-time role for fresh graduates. You will be responsible for software development, debugging, testing, and collaborating with cross-functional product teams.",
                "₹12,00,000 - ₹16,00,000 / annum", alumni1);
        jobRepository.save(job3);

        // 3. Seed Reels
        Reel reel1 = new Reel("https://assets.mixkit.co/videos/preview/mixkit-web-developer-working-on-his-computer-42031-large.mp4",
                "A day in the life of a Google Software Engineer! Working on critical API endpoints today. #Google #CodingLife", alumni1);
        reel1.setLikesCount(142);
        reel1.setCommentsCount(2);
        reel1 = reelRepository.save(reel1);

        Reel reel2 = new Reel("https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-cyberpunk-look-39810-large.mp4",
                "AI models training! GPU fans screaming. 💻🔥 #AI #Cyberpunk #Meta", alumni2);
        reel2.setLikesCount(89);
        reel2.setCommentsCount(1);
        reel2 = reelRepository.save(reel2);

        Reel reel3 = new Reel("https://assets.mixkit.co/videos/preview/mixkit-man-working-on-a-laptop-in-a-coffee-shop-41805-large.mp4",
                "Coffee shop coding sessions are unmatched. Crafting React dashboards! ☕🚀", alumni1);
        reel3.setLikesCount(64);
        reel3.setCommentsCount(0);
        reel3 = reelRepository.save(reel3);

        // 4. Seed Reel Comments
        commentRepository.save(new Comment("This is awesome, Neha! What codebase do you guys primarily use?", reel1.getId(), student1));
        commentRepository.save(new Comment("We use mostly Java and Go for backends, and TypeScript + React for UI!", reel1.getId(), alumni1));
        commentRepository.save(new Comment("Woah, that GPU power! Is it running locally or on cloud clusters?", reel2.getId(), student2));

        // 5. Seed Photos
        photoRepository.save(new Photo("https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop", "Alumni Tech Summit 2026 - Panel Discussion", "EVENT", alumni1));
        photoRepository.save(new Photo("https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop", "Mentorship Workshop with Google Engineers", "WORKPLACE", alumni1));
        photoRepository.save(new Photo("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop", "AI Research Lab at Meta campus", "WORKPLACE", alumni2));

        // 6. Seed Events
        eventRepository.save(new Event("Cracking FAANG Interviews in 2026", "A deep-dive interactive session on System Design, Data Structures, and behavioral strategies.", "Aug 15, 2026 • 6:00 PM IST", "https://meet.google.com/abc-defg-hij", "WEBINAR", alumni1));
        eventRepository.save(new Event("Generative AI & LLM Frontiers Workshop", "Live code-along building custom RAG pipelines with LangChain and PyTorch.", "Aug 22, 2026 • 7:30 PM IST", "https://zoom.us/j/123456789", "WORKSHOP", alumni2));
    }
}
