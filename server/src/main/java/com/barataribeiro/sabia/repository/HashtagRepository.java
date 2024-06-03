package com.barataribeiro.sabia.repository;

import com.barataribeiro.sabia.model.Hashtag;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HashtagRepository extends JpaRepository<Hashtag, String> {
    @EntityGraph(attributePaths = {"hashtagPosts"})
    Optional<Hashtag> findByTag(String tag);
}
