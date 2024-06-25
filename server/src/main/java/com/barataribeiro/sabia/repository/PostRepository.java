package com.barataribeiro.sabia.repository;

import com.barataribeiro.sabia.model.entities.Post;
import com.barataribeiro.sabia.model.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, String> {

    @Override
    @EntityGraph(attributePaths = {"author", "repostOff.hashtags", "inReplyTo.hashtags", "postHashtags", "likes", "reposts.hashtags", "replies.hashtags", "hashtags"})
    @NonNull
    Optional<Post> findById(@NonNull @Param("postId") String postId);

    @EntityGraph(attributePaths = {"author", "repostOff.hashtags", "inReplyTo.hashtags", "postHashtags", "likes", "reposts.hashtags", "replies.hashtags", "hashtags"})
    Page<Post> findDistinctAllByAuthorIdOrderByCreatedAtDesc(@Param("authorId") String authorId, Pageable pageable);

    @EntityGraph(attributePaths = {"author", "repostOff.hashtags", "inReplyTo.hashtags", "postHashtags", "likes", "reposts.hashtags", "replies.hashtags", "hashtags"})
    @Query("SELECT p FROM Post p WHERE p.inReplyTo.id = :postId" +
            " ORDER BY p.createdAt DESC")
    Page<Post> findRepliesByPostId(@Param("postId") String postId, Pageable pageable);

    @EntityGraph(attributePaths = {"author", "repostOff.hashtags", "inReplyTo.hashtags", "postHashtags", "likes", "reposts.hashtags", "replies.hashtags", "hashtags"})
    @Query("SELECT p FROM Post p JOIN p.postHashtags hp " +
            "WHERE hp.hashtags.tag = :tag")
    Page<Post> findAllByHashtag(@Param("tag") String tag, Pageable pageable);

    @EntityGraph(attributePaths = {"author", "repostOff.hashtags", "inReplyTo.hashtags", "postHashtags", "likes", "reposts.hashtags", "replies.hashtags", "hashtags"})
    @Query("SELECT p FROM Post p WHERE " +
            "LOWER(p.text) LIKE LOWER(CONCAT('%', :text, '%'))")
    Page<Post> findAllByTextContaining(@Param("text") String text, Pageable pageable);

    @EntityGraph(attributePaths = {"author", "repostOff.hashtags", "inReplyTo.hashtags", "postHashtags", "likes", "reposts.hashtags", "replies.hashtags", "hashtags"})
    Page<Post> findDistinctByAuthorInOrderByCreatedAtDesc(List<User> authors, Pageable pageable);


}
