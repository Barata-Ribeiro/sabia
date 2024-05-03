package com.barataribeiro.sabia.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;

import java.time.Instant;
import java.util.*;

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

    @ElementCollection
    private Map<String, Date> hashtags = new HashMap<>();

    @Builder.Default
    @ManyToMany(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinTable(name = "post_hashtags",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "hashtag_id"))
    @JsonIgnore
    @ToString.Exclude
    private Set<Hashtag> post_hashtags = new HashSet<>();

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
    private Set<Like> likes = new HashSet<>();

    @Column
    @CreationTimestamp
    private Instant created_at;

    @Column
    @UpdateTimestamp
    private Instant updated_at;

    public void incrementLikeCount() {
        ++like_count;
    }

    public void decrementLikeCount() {
        like_count = like_count > 0 ? --like_count : 0;
    }

    public void incrementRepostCount() {
        ++repost_count;
    }

    public void decrementRepostCount() {
        repost_count = repost_count > 0 ? --repost_count : 0;
    }
}
