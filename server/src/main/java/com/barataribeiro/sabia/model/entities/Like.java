package com.barataribeiro.sabia.model.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "likes", indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_like_post_id", columnList = "post_id"),
        @Index(name = "idx_like_user_id_post_id", columnList = "user_id, post_id")
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, unique = true)
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, updatable = false, referencedColumnName = "id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false, updatable = false, referencedColumnName = "id")
    private Post post;

    @Column(updatable = false, nullable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;
}
