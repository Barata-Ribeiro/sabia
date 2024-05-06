package com.barataribeiro.sabia.repository;

import com.barataribeiro.sabia.model.Post;
import com.barataribeiro.sabia.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, String> {
    Page<Post> findAllByAuthorId(String authorId, Pageable pageable);

    @Query("SELECT p FROM Post p JOIN p.postHashtags hp WHERE hp.hashtags.tag = :tag")
    Page<Post> findAllByHashtag(@Param("tag") String tag, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE " +
            "LOWER(p.text) LIKE LOWER(CONCAT('%', :text, '%'))")
    Page<Post> findAllByTextContaining(@Param("text") String text, Pageable pageable);

    Page<Post> findByAuthorInOrderByCreatedAtDesc(List<User> authors, Pageable pageable);
}
