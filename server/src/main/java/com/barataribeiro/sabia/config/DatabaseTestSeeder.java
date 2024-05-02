package com.barataribeiro.sabia.config;

import com.barataribeiro.sabia.model.Post;
import com.barataribeiro.sabia.model.Roles;
import com.barataribeiro.sabia.model.User;
import com.barataribeiro.sabia.repository.PostRepository;
import com.barataribeiro.sabia.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;

@Configuration
public class DatabaseTestSeeder {

    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository, PostRepository postRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Create two users
            User user1 = new User();
            user1.setUsername("user1");
            user1.setDisplay_name("User One");
            user1.setFull_name("User One Full Name");
            user1.setBirth_date("2001-01-01");
            user1.setEmail("user1@example.com");
            user1.setPassword(passwordEncoder.encode("password1"));
            user1.setRole(Roles.MEMBER);

            User user2 = new User();
            user2.setUsername("user2");
            user2.setDisplay_name("User Two");
            user2.setFull_name("User Two Full name");
            user2.setBirth_date("2000-01-01");
            user2.setEmail("user2@example.com");
            user2.setPassword(passwordEncoder.encode("password2"));
            user2.setRole(Roles.MEMBER);

            // Save users to UserRepository
            userRepository.saveAll(Arrays.asList(user1, user2));

            // Create posts
            for (int i = 1; i <= 10; i++) {
                Post post1 = new Post();
                post1.setAuthor(user1);
                post1.setText("Post " + i + " from User One");
                postRepository.save(post1);

                Post post2 = new Post();
                post2.setAuthor(user2);
                post2.setText("Post " + i + " from User Two");
                postRepository.save(post2);
            }
        };
    }
}
