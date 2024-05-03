package com.barataribeiro.sabia.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
}, indexes = {
        @Index(name = "idx_username", columnList = "username"),
        @Index(name = "idx_email", columnList = "email")
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
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

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private Roles role = Roles.MEMBER;

    private String avatar_image_url;
    private String cover_image_url;
    private String biography;
    private String website;
    private String location;

    @Builder.Default
    @Column(columnDefinition = "boolean default false", nullable = false)
    private Boolean is_verified = false;

    @Builder.Default
    @Column(columnDefinition = "boolean default false", nullable = false)
    private Boolean is_private = false;

    @Builder.Default
    @OneToMany(mappedBy = "follower", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private Set<Follow> followers = new HashSet<>();

    @Builder.Default
    @Column(name = "follower_count", columnDefinition = "BIGINT default '0'", nullable = false)
    private Long follower_count = 0L;

    @Builder.Default
    @OneToMany(mappedBy = "followed", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private Set<Follow> followings = new HashSet<>();

    @Builder.Default
    @Column(name = "following_count", columnDefinition = "BIGINT default '0'", nullable = false)
    private Long following_count = 0L;

    @Builder.Default
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private Set<Post> posts = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private Set<Like> liked_posts = new HashSet<>();

    @Column
    @CreationTimestamp
    private Instant created_at;

    @Column
    @UpdateTimestamp
    private Instant updated_at;

    public void incrementFollowerCount() {
        ++follower_count;
    }

    public void decrementFollowerCount() {
        follower_count = follower_count > 0 ? --follower_count : 0;
    }

    public void incrementFollowingCount() {
        ++following_count;
    }

    public void decrementFollowingCount() {
        following_count = following_count > 0 ? --following_count : 0;
    }
}
