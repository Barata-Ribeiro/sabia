package com.barataribeiro.sabia.model.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "follows",
        indexes = {
                @Index(name = "idx_follower_id", columnList = "follower_id"),
                @Index(name = "idx_followed_id", columnList = "followed_id")
        },
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"follower_id", "followed_id"})
        })
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class Follow {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, unique = true)
    private String id;

    @ManyToOne
    @JoinColumn(name = "follower_id", nullable = false, updatable = false)
    private User follower;

    @ManyToOne
    @JoinColumn(name = "followed_id", nullable = false, updatable = false)
    private User followed;

    @Column(updatable = false, nullable = false)
    @CreationTimestamp
    private Instant followedAt;

}
