package com.barataribeiro.sabia.repository;

import com.barataribeiro.sabia.model.Follow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, String> {
    Boolean existsByFollowerIdAndFollowedId(String followerId, String followedId);

    Optional<Follow> findByFollowerIdAndFollowedId(String followerId, String followedId);

    Page<Follow> findByFollowedUsernameOrderByFollowedAtDesc(String followedId, Pageable pageable);
}
