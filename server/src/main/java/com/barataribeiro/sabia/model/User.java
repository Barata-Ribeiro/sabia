package com.barataribeiro.sabia.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
}, indexes = {
        @Index(name = "idx_username", columnList = "username"),
        @Index(name = "idx_email", columnList = "email")
})
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, unique = true)
    private String id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String display_name;

    @Column(nullable = false)
    private String full_name;

    @Column(nullable = false)
    private String birth_date;

    private String gender;

    @Column(nullable = false, unique = true)
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

    @Column(columnDefinition = "boolean default false", nullable = false)
    private Boolean is_verified = false;

    @Column(columnDefinition = "boolean default false", nullable = false)
    private Boolean is_private = false;

    @Column(name = "follower_count", columnDefinition = "BIGINT(20) default '0'", nullable = false)
    private Long follower_count = 0L;

    @Column(name = "following_count", columnDefinition = "BIGINT(20) default '0'", nullable = false)
    private Long following_count = 0L;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Post> posts = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Like> liked_posts = new ArrayList<>();

    @Column
    @CreationTimestamp
    private Instant created_at;

    @Column
    @UpdateTimestamp
    private Instant updated_at;
}
