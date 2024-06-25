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
    private Long viewsCount = 0L;


    @Builder.Default
    @Column(columnDefinition = "BIGINT default '0'", nullable = false)
    private Long likeCount = 0L;

    @Builder.Default
    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private Set<Like> likes = new HashSet<>();


    @Builder.Default
    @OneToMany(mappedBy = "repostOff")
    @JsonIgnore
    @ToString.Exclude
    private Set<Post> reposts = new HashSet<>();

    @ManyToOne
    private Post repostOff;

    @Builder.Default
    @Column(columnDefinition = "BIGINT default '0'", nullable = false)
    private Long repostCount = 0L;


    @Builder.Default
    @OneToMany(mappedBy = "inReplyTo")
    @JsonIgnore
    @ToString.Exclude
    private Set<Post> replies = new HashSet<>();

    @Builder.Default
    @Column(columnDefinition = "BIGINT default '0'", nullable = false)
    private Long replyCount = 0L;

    @ManyToOne
    private Post inReplyTo;


    @Column(updatable = false, nullable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    public void incrementViewCount() {
        ++viewsCount;
    }

    public void incrementLikeCount() {
        ++likeCount;
    }

    public void decrementLikeCount() {
        likeCount = likeCount > 0 ? --likeCount : 0;
    }

    public void incrementRepostCount() {
        ++repostCount;
    }

    public void decrementRepostCount() {
        repostCount = repostCount > 0 ? --repostCount : 0;
    }

    public void incrementReplyCount() {
        ++replyCount;
    }

    public void decrementReplyCount() {
        replyCount = replyCount > 0 ? --replyCount : 0;
    }
}
