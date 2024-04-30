package com.barataribeiro.sabia.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "likes", indexes = @Index(name = "idx_user_id", columnList = "user_id"))
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, unique = true)
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, updatable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false, updatable = false)
    private Post post;

    @Column
    @CreationTimestamp
    private Instant created_at;

    @Column
    @UpdateTimestamp
    private Instant updated_at;
}
