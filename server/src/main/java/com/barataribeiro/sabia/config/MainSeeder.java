package com.barataribeiro.sabia.config;

import com.barataribeiro.sabia.builder.UserMapper;
import com.barataribeiro.sabia.model.HashtagPosts;
import com.barataribeiro.sabia.model.entities.Hashtag;
import com.barataribeiro.sabia.model.entities.Post;
import com.barataribeiro.sabia.model.entities.User;
import com.barataribeiro.sabia.model.enums.Roles;
import com.barataribeiro.sabia.repository.HashtagPostsRepository;
import com.barataribeiro.sabia.repository.HashtagRepository;
import com.barataribeiro.sabia.repository.PostRepository;
import com.barataribeiro.sabia.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.event.Level;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class MainSeeder {
    private final Logger logger = LoggerFactory.getLogger(MainSeeder.class);
    private final Random random = new Random();

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final HashtagRepository hashtagRepository;
    private final HashtagPostsRepository hashtagPostsRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;


    @Value("${api.security.seeder.admin.username}")
    private String adminUsername;

    @Value("${api.security.seeder.admin.displayName}")
    private String adminDisplayName;

    @Value("${api.security.seeder.admin.fullName}")
    private String adminFullName;

    @Value("${api.security.seeder.admin.birthDate}")
    private String adminBirthDate;

    @Value("${api.security.seeder.admin.password}")
    private String adminPassword;

    @Value("${api.security.seeder.admin.email}")
    private String adminEmail;

    @Value("${api.security.seeder.admin.avatarUrl}")
    private String adminAvatarUrl;

    @Value("${api.security.seeder.admin.coverUrl}")
    private String adminCoverUrl;

    @PostConstruct
    @Transactional
    public void adminSeeding() {
        User admin = userRepository.findByUsername(adminUsername).orElseGet(this::attemptToCreateUserWithAdminRights);

        seedDatabaseWithLoremImpsunPosts(Post.builder().author(admin), postRepository);

        seedDatabaseWithPostContainingHashtag(Post.builder().author(admin), postRepository, hashtagRepository, hashtagPostsRepository);

        logger.atLevel(Level.INFO).log("Admin: {}", userMapper.toDTO(admin).toString());
    }

    @PostConstruct
    @Transactional
    public void userSeeding() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        User user1 = userRepository.findByUsername("user1")
                .orElseGet(() -> User.builder()
                        .username("user1")
                        .displayName("User One")
                        .fullName("User One Full Name")
                        .birthDate(LocalDate.of(2001, 1, 1).format(formatter))
                        .email("user1@example.com")
                        .password(passwordEncoder.encode(generateRandomPassword(random)))
                        .role(Roles.MEMBER)
                        .build());

        User user2 = userRepository.findByUsername("user2")
                .orElseGet(() -> User.builder()
                        .username("user2")
                        .displayName("User Two")
                        .fullName("User Two Full name")
                        .birthDate(LocalDate.of(2000, 1, 1).format(formatter))
                        .email("user2@example.com")
                        .password(passwordEncoder.encode(generateRandomPassword(random)))
                        .role(Roles.MEMBER)
                        .build());

        User jason = userRepository.findByUsername("jasonbourne")
                .orElseGet(() -> User.builder()
                        .username("jasonbourne")
                        .displayName("Jason Bourne")
                        .fullName("Jason Bourne")
                        .birthDate(LocalDate.of(1969, 8, 21).format(formatter))
                        .email("jasonbourne@cia.com")
                        .avatarImageUrl("https://avatarfiles.alphacoders.com/153/153804.jpg")
                        .coverImageUrl("https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?fm=jpg&fit=crop&w=1920&q=80&fit=max")
                        .password(passwordEncoder.encode(generateRandomPassword(random)))
                        .isVerified(true)
                        .role(Roles.MEMBER)
                        .build());

        List<User> usersSeed = userRepository.saveAll(List.of(user1, user2, jason));

        for (int i = 1; i <= 200; i++) {
            Post post1 = Post.builder()
                    .author(usersSeed.get(i % 3))
                    .text("Post " + i + " from User One")
                    .build();

            postRepository.save(post1);

            Post post2 = Post.builder()
                    .author(usersSeed.get(i % 3))
                    .text("Post " + i + " from User Two, #enjoy #hashtag" + i)
                    .build();

            postRepository.save(post2);

            seedDatabaseWithPostContainingHashtag(Post.builder().author(usersSeed.get(i % 3)), postRepository, hashtagRepository, hashtagPostsRepository);
        }
    }

    private @NotNull String generateRandomPassword(Random random) {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < 10; i++) {
            password.append(characters.charAt(random.nextInt(characters.length())));
        }

        return password.toString();
    }

    private void seedDatabaseWithPostContainingHashtag(Post.@NotNull PostBuilder admin,
                                                       @NotNull PostRepository postRepository,
                                                       HashtagRepository hashtagRepository,
                                                       HashtagPostsRepository hashtagPostsRepository) {
        Post postWithHashtag = admin
                .text("Hello, world! #FirstHashtag #HelloWorld #Java")
                .build();

        Post savedPost = postRepository.saveAndFlush(postWithHashtag);

        Pattern pattern = Pattern.compile("#\\w+");
        Matcher matcher = pattern.matcher(savedPost.getText());

        while (matcher.find()) {
            String hashtagText = matcher.group().substring(1); // remove '#'
            Hashtag hashtag = hashtagRepository.findByTag(hashtagText)
                    .orElseGet(() -> {
                        Hashtag newHashtag = Hashtag.builder()
                                .tag(hashtagText)
                                .build();

                        return hashtagRepository.save(newHashtag);
                    });

            HashtagPosts hashtagPost = HashtagPosts.builder()
                    .hashtags(hashtag)
                    .posts(savedPost)
                    .build();

            hashtagPostsRepository.saveAndFlush(hashtagPost);

            ArrayList<HashtagPosts> postHashtags = new ArrayList<>(List.of(hashtagPost));

            savedPost.setPostHashtags(postHashtags);
        }

        postRepository.save(savedPost);
    }

    private void seedDatabaseWithLoremImpsunPosts(Post.PostBuilder admin, PostRepository postRepository) {
        for (int i = 1; i <= 50; i++) {
            Post post = admin
                    .text("Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
                                  "Nulla metus metus, aliquet ac commodo nec, " +
                                  "pulvinar in eros. Vestibulum nec ex quis erat vehicula luctus. " +
                                  "Nulla congue ligula nisi, non vestibulum lectus tempus in. " +
                                  "Mauris gravida hendrerit sem non rutrum.")
                    .build();

            postRepository.save(post);
        }
    }

    private User attemptToCreateUserWithAdminRights() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        LocalDate birthDate = LocalDate.parse(adminBirthDate, formatter);

        User admin = User.builder()
                .username(adminUsername)
                .displayName(adminDisplayName)
                .fullName(adminFullName)
                .birthDate(birthDate.format(formatter))
                .email(adminEmail)
                .avatarImageUrl(adminAvatarUrl)
                .coverImageUrl(adminCoverUrl)
                .password(passwordEncoder.encode(adminPassword))
                .role(Roles.ADMIN)
                .isVerified(true)
                .build();

        userRepository.save(admin);

        return admin;
    }
}
