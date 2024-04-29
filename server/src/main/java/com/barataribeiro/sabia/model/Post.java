package com.barataribeiro.sabia.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "posts", indexes = @Index(name = "idx_author_id", columnList = "author_id"))
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(nullable = false)
    private String content;

    private Integer views;

    @Column(name = "created_at")
    private LocalDateTime created_at = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updated_at = LocalDateTime.now();
}
