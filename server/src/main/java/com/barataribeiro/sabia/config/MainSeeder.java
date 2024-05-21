package com.barataribeiro.sabia.config;

import com.barataribeiro.sabia.model.*;
import com.barataribeiro.sabia.repository.HashtagPostsRepository;
import com.barataribeiro.sabia.repository.HashtagRepository;
import com.barataribeiro.sabia.repository.PostRepository;
import com.barataribeiro.sabia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Configuration
public class MainSeeder {
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


    @Bean
    public CommandLineRunner seedDatabase(UserRepository userRepository,
                                          PostRepository postRepository,
                                          HashtagRepository hashtagRepository,
                                          HashtagPostsRepository hashtagPostsRepository,
                                          PasswordEncoder passwordEncoder) {
        return args -> {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            LocalDate birthDate = LocalDate.parse(ADMIN_BIRTH_DATE, formatter);

            // Create Main Admin
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

            userRepository.saveAndFlush(admin);

            System.out.println("Admin: " + admin);

            // Populate the database with some posts for main admin
            for (int i = 1; i <= 5; i++) {
                Post post = Post.builder()
                        .author(admin)
                        .text("Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
                                      "Nulla metus metus, aliquet ac commodo nec, " +
                                      "pulvinar in eros. Vestibulum nec ex quis erat vehicula luctus. " +
                                      "Nulla congue ligula nisi, non vestibulum lectus tempus in. " +
                                      "Mauris gravida hendrerit sem non rutrum.")
                        .build();

                postRepository.save(post);
            }

            Post postWithHashtag = Post.builder()
                    .author(admin)
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
        };
    }
}
