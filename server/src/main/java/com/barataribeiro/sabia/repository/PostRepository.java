package com.barataribeiro.sabia.repository;

import com.barataribeiro.sabia.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, String> {
    Page<Post> findAllByAuthorId(String authorId, Pageable pageable);
}
