package com.barataribeiro.sabia.repository;

import com.barataribeiro.sabia.model.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    @Override
    @EntityGraph(attributePaths = {"followers", "followings", "posts.hashtags", "likedPosts"})
    @NonNull
    Optional<User> findById(@NonNull @Param("userId") String userId);

    @EntityGraph(attributePaths = {"followers", "followings", "posts.hashtags", "likedPosts"})
    Optional<User> findByUsername(@Param("username") String username);

    @EntityGraph(attributePaths = {"followers", "followings", "posts.hashtags", "likedPosts"})
    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(u.displayName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<User> searchByQuery(@Param("query") String query, Pageable pageable);

    Boolean existsByUsername(@Param("username") String username);

    Boolean existsByEmail(@Param("email") String email);
}
