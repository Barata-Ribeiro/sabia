package com.barataribeiro.sabia.repository;

import com.barataribeiro.sabia.model.User;
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
    @EntityGraph(attributePaths = {"posts", "liked_posts", "followers", "followings"})
    @NonNull
    Optional<User> findById(@NonNull String userId);

    @EntityGraph(attributePaths = {"posts", "liked_posts", "followers", "followings"})
    Optional<User> findByUsername(String username);

    @EntityGraph(attributePaths = {"posts", "liked_posts", "followers", "followings"})
    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(u.display_name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<User> searchByQuery(@Param("query") String query, Pageable pageable);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}
