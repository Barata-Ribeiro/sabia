package com.barataribeiro.sabia.repository;

import com.barataribeiro.sabia.model.Hashtag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HashtagRepository extends JpaRepository<Hashtag, String> {
    Optional<Hashtag> findByTag(String tag);
}
