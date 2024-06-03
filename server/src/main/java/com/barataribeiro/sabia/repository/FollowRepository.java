package com.barataribeiro.sabia.repository;

import com.barataribeiro.sabia.model.Follow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, String> {
    Boolean existsByFollowerIdAndFollowedId(String followerId, String followedId);

    @EntityGraph(attributePaths = {"follower", "followed"})
    Optional<Follow> findByFollowerIdAndFollowedId(String followerId, String followedId);

    @EntityGraph(attributePaths = {"follower", "followed"})
    Page<Follow> findByFollowed_UsernameOrderByFollowedAtDesc(String username, Pageable pageable);
}
