package com.barataribeiro.sabia.repository;

import com.barataribeiro.sabia.model.entities.Like;
import com.barataribeiro.sabia.model.entities.Post;
import com.barataribeiro.sabia.model.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeRepository extends JpaRepository<Like, String> {
    void deleteByUserAndPost(User user, Post post);

    Boolean existsByUser_UsernameAndPostId(String username, String postId);
}
