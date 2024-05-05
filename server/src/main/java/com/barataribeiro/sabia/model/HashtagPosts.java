package com.barataribeiro.sabia.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "hashtag_posts")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class HashtagPosts {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, unique = true)
    private String id;

    @ManyToOne(targetEntity = Hashtag.class)
    @JoinColumn(
            name = "hashtags_id",
            updatable = false,
            nullable = false)
    private Hashtag hashtags;

    @ManyToOne(targetEntity = Post.class)
    @JoinColumn(
            name = "posts_id",
            updatable = false,
            nullable = false)
    private Post posts;

    @Column(name = "created_at")
    @CreationTimestamp
    private Instant createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Instant updatedAt;
}
