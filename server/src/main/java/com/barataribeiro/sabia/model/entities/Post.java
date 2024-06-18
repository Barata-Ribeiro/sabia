package com.barataribeiro.sabia.model.entities;

import com.barataribeiro.sabia.model.HashtagPosts;
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

    @Column(nullable = false, length = 280)
    private String text;

    @ElementCollection
    private Map<String, Date> hashtags = new HashMap<>();

    @OneToMany(mappedBy = "posts", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private List<HashtagPosts> postHashtags = new ArrayList<>();

    @Builder.Default
    @Column(columnDefinition = "BIGINT default '0'", nullable = false)
    private Long views_count = 0L;


    @Builder.Default
    @Column(columnDefinition = "BIGINT default '0'", nullable = false)
    private Long like_count = 0L;

    @Builder.Default
    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private Set<Like> likes = new HashSet<>();


    @Builder.Default
    @OneToMany(mappedBy = "repost_off")
    @JsonIgnore
    @ToString.Exclude
    private Set<Post> reposts = new HashSet<>();

    @ManyToOne
    private Post repost_off;

    @Builder.Default
    @Column(columnDefinition = "BIGINT default '0'", nullable = false)
    private Long repost_count = 0L;


    @Builder.Default
    @OneToMany(mappedBy = "in_reply_to")
    @JsonIgnore
    @ToString.Exclude
    private Set<Post> replies = new HashSet<>();

    @Builder.Default
    @Column(columnDefinition = "BIGINT default '0'", nullable = false)
    private Long reply_count = 0L;

    @ManyToOne
    private Post in_reply_to;


    @Column(name = "created_at", updatable = false, nullable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    public void incrementViewCount() {
        ++views_count;
    }

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

    public void incrementReplyCount() {
        ++reply_count;
    }

    public void decrementReplyCount() {
        reply_count = reply_count > 0 ? --reply_count : 0;
    }
}
