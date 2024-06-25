package com.barataribeiro.sabia.model.entities;


import com.barataribeiro.sabia.model.enums.Roles;
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
    private String displayName;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String birthDate;

    private String gender;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private Roles role = Roles.MEMBER;

    private String avatarImageUrl;
    private String coverImageUrl;
    private String biography;
    private String website;
    private String location;

    @Builder.Default
    @Column(columnDefinition = "boolean default false", nullable = false)
    private Boolean isVerified = false;

    @Builder.Default
    @Column(columnDefinition = "boolean default false", nullable = false)
    private Boolean isPrivate = false;

    @Builder.Default
    @OneToMany(mappedBy = "followed", fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private Set<Follow> followers = new HashSet<>();

    @Builder.Default
    @Column(name = "followerCount", columnDefinition = "BIGINT default '0'", nullable = false)
    private Long followerCount = 0L;

    @Builder.Default
    @OneToMany(mappedBy = "follower", fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private Set<Follow> followings = new HashSet<>();

    @Builder.Default
    @Column(name = "followingCount", columnDefinition = "BIGINT default '0'", nullable = false)
    private Long followingCount = 0L;

    @Builder.Default
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private Set<Post> posts = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private Set<Like> likedPosts = new HashSet<>();

    @Column(updatable = false, nullable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    public void incrementFollowerCount() {
        ++followerCount;
    }

    public void decrementFollowerCount() {
        followerCount = followerCount > 0 ? --followerCount : 0;
    }

    public void incrementFollowingCount() {
        ++followingCount;
    }

    public void decrementFollowingCount() {
        followingCount = followingCount > 0 ? --followingCount : 0;
    }
}
