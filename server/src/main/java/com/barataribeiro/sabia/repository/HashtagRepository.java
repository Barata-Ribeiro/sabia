package com.barataribeiro.sabia.repository;

import com.barataribeiro.sabia.model.entities.Hashtag;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface HashtagRepository extends JpaRepository<Hashtag, String> {
    @EntityGraph(attributePaths = {"hashtagPosts"})
    Optional<Hashtag> findByTag(String tag);

    @Query("select h, COUNT(hp) FROM Hashtag h join h.hashtagPosts hp GROUP BY h ORDER BY COUNT(hp) DESC")
    List<Hashtag> findTrendingHashtags(Pageable pageable);
}
