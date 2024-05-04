package com.barataribeiro.sabia.repository;

import com.barataribeiro.sabia.model.Hashtag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HashtagRepository extends JpaRepository<Hashtag, String> {
    Optional<Hashtag> findByTag(String tag);

    List<Hashtag> findByTagIn(List<String> tags);
    
    boolean existsByTag(String tag);
}
