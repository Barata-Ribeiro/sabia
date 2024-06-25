package com.barataribeiro.sabia.model.entities;

import com.barataribeiro.sabia.model.HashtagPosts;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hashtags", indexes = {
        @Index(name = "idx_tag", columnList = "tag"),
        @Index(name = "idx_hashtag_tag_unq", columnList = "tag", unique = true)
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class Hashtag {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, unique = true)
    private String id;

    @Column(unique = true, nullable = false)
    private String tag;

    @Transient
    private Long postsCount;

    @OneToMany(mappedBy = "hashtags", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private List<HashtagPosts> hashtagPosts = new ArrayList<>();

    @Column(updatable = false, nullable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    public Long getPostsCount() {
        return (long) hashtagPosts.size();
    }
}
