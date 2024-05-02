package com.barataribeiro.sabia.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts", indexes = @Index(name = "idx_author_id", columnList = "author_id"))
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, unique = true)
    private String id;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false, updatable = false)
    @CreatedBy
    private User author;

    @Column(nullable = false)
    private String text;

    private Integer views;

    @Builder.Default
    @Column(columnDefinition = "BIGINT default '0'", nullable = false)
    private Long repost_count = 0L;

    @Builder.Default
    @Column(columnDefinition = "BIGINT default '0'", nullable = false)
    private Long like_count = 0L;

    @Builder.Default
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private List<Like> likes = new ArrayList<>();

    @Column
    @CreationTimestamp
    private Instant created_at;

    @Column
    @UpdateTimestamp
    private Instant updated_at;

    public long incrementLikeCount() {
        return ++like_count;
    }

    public long decrementLikeCount() {
        return --like_count;
    }

    public long incrementRepostCount() {
        return ++repost_count;
    }

    public long decrementRepostCount() {
        return (repost_count > 0) ? --repost_count : 0;
    }
}
