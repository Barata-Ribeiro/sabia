package com.barataribeiro.sabia.repository;

import com.barataribeiro.sabia.model.HashtagPosts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HashtagPostsRepository extends JpaRepository<HashtagPosts, String> {

}