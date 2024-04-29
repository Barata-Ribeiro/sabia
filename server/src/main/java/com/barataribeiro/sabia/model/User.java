package com.barataribeiro.sabia.model;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.Email;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String display_name;

    @Column(nullable = false)
    private String full_name;

    @Column(nullable = false, unique = true)
    @Email(message = "Use a valid email")
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Roles role = Roles.MEMBER;

    private String avatar_image_url;
    private String cover_image_url;
    private String biography;
    private String website;
    private String location;

    @Column(columnDefinition = "boolean default false")
    private Boolean is_verified = false;

    @Column(columnDefinition = "boolean default false")
    private Boolean is_private = false;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Post> posts = new HashSet<>();

    @Column(name = "created_at")
    private LocalDateTime created_at = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updated_at = LocalDateTime.now();
}
