package com.barataribeiro.sabia.repository;

import com.barataribeiro.sabia.model.Like;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, String> {
    @EntityGraph(attributePaths = {"user", "post"})
    Optional<Like> findByUserIdAndPostId(String userId, String postId);

    Boolean existsByUser_UsernameAndPostId(String username, String postId);
}
