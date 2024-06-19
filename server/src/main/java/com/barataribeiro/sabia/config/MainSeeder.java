package com.barataribeiro.sabia.config;

import com.barataribeiro.sabia.model.*;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class MainSeeder {
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final HashtagRepository hashtagRepository;
    private final HashtagPostsRepository hashtagPostsRepository;
    private final PasswordEncoder passwordEncoder;


    @Value("${api.security.seeder.admin.username}")
    private String ADMIN_USERNAME;

    @Value("${api.security.seeder.admin.displayName}")
    private String ADMIN_DISPLAY_NAME;

    @Value("${api.security.seeder.admin.fullName}")
    private String ADMIN_FULL_NAME;

    @Value("${api.security.seeder.admin.birthDate}")
    private String ADMIN_BIRTH_DATE;

    @Value("${api.security.seeder.admin.password}")
    private String ADMIN_PASSWORD;

    @Value("${api.security.seeder.admin.email}")
    private String ADMIN_EMAIL;

    @Value("${api.security.seeder.admin.avatarUrl}")
    private String ADMIN_AVATAR_URL;

    @Value("${api.security.seeder.admin.coverUrl}")
    private String ADMIN_COVER_URL;

    @PostConstruct
    @Transactional
    public void adminSeeding() {
        User admin = userRepository.findByUsername(ADMIN_USERNAME).orElseGet(this::attemptToCreateUserWithAdminRights);

        seedDatabaseWithLoremImpsunPosts(Post.builder().author(admin), postRepository);

        seedDatabaseWithPostContainingHashtag(Post.builder().author(admin), postRepository, hashtagRepository, hashtagPostsRepository);

        System.out.printf("Admin: %s%n", admin);
    }

    @PostConstruct
    @Transactional
    public void userSeeding() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        
        User user1 = userRepository.findByUsername("user1")
                .orElseGet(() -> User.builder()
                                .username("user1")
                                .display_name("User One")
                                .full_name("User One Full Name")
                                .birth_date(LocalDate.of(2001, 1, 1).format(formatter))
                                .email("user1@example.com")
                                .password(passwordEncoder.encode("password1"))
                                .role(Roles.MEMBER)
                                .build());

        User user2 = userRepository.findByUsername("user2")
                .orElseGet(() -> User.builder()
                                .username("user2")
                                .display_name("User Two")
                                .full_name("User Two Full name")
                                .birth_date(LocalDate.of(2000, 1, 1).format(formatter))
                                .email("user2@example.com")
                                .password(passwordEncoder.encode("password2"))
                                .role(Roles.MEMBER)
                                .build());

        User jason = userRepository.findByUsername("jasonbourne")
                .orElseGet(() -> User.builder()
                                .username("jasonbourne")
                                .display_name("Jason Bourne")
                                .full_name("Jason Bourne")
                                .birth_date(LocalDate.of(1969, 8, 21).format(formatter))
                                .email("jasonbourne@cia.com")
                                .avatar_image_url("https://avatarfiles.alphacoders.com/153/153804.jpg")
                                .cover_image_url("https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?fm=jpg&fit=crop&w=1920&q=80&fit=max")
                                .password(passwordEncoder.encode("25)9vteIYzPYLivd"))
                                .is_verified(true)
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
        LocalDate birthDate = LocalDate.parse(ADMIN_BIRTH_DATE, formatter);

        User admin = User.builder()
                .username(ADMIN_USERNAME)
                .display_name(ADMIN_DISPLAY_NAME)
                .full_name(ADMIN_FULL_NAME)
                .birth_date(birthDate.format(formatter))
                .email(ADMIN_EMAIL)
                .avatar_image_url(ADMIN_AVATAR_URL)
                .cover_image_url(ADMIN_COVER_URL)
                .password(passwordEncoder.encode(ADMIN_PASSWORD))
                .role(Roles.ADMIN)
                .is_verified(true)
                .build();

        userRepository.save(admin);

        return admin;
    }
}
