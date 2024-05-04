package com.barataribeiro.sabia.repository;

import com.barataribeiro.sabia.model.Hashtag;
import com.barataribeiro.sabia.model.HashtagPosts;
import com.barataribeiro.sabia.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HashtagPostsRepository extends JpaRepository<HashtagPosts, String> {
    List<Post> findByHashtags(Hashtag hashtag);

    List<Hashtag> findByPosts(Post post);
}