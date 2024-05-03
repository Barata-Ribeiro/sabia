package com.barataribeiro.sabia.repository;

import com.barataribeiro.sabia.model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FollowRepository extends JpaRepository<Follow, String> {
    Boolean existsByFollowerIdAndFollowedId(String followerId, String followedId);
}
