package com.barataribeiro.sabia.repository;

import com.barataribeiro.sabia.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends JpaRepository<Post, String> {
    Page<Post> findAllByAuthorId(String authorId, Pageable pageable);

    @Query("SELECT p FROM Post p JOIN p.post_hashtags h WHERE h.tag = :tag")
    Page<Post> findAllByHashtag(@Param("tag") String tag, Pageable pageable);
}
