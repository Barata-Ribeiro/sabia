package com.barataribeiro.sabia.util;

import com.barataribeiro.sabia.dto.post.PostResponseDTO;
import com.barataribeiro.sabia.dto.user.AuthorResponseDTO;
import com.barataribeiro.sabia.dto.user.ContextResponseDTO;
import com.barataribeiro.sabia.dto.user.PublicProfileResponseDTO;
import com.barataribeiro.sabia.model.HashtagPosts;
import com.barataribeiro.sabia.model.Post;
import com.barataribeiro.sabia.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class EntityMapper {
    public PostResponseDTO getPostResponseDTO(Post post) {
        User author = post.getAuthor();
        AuthorResponseDTO authorDTO = new AuthorResponseDTO(
                author.getId(),
                author.getUsername(),
                author.getDisplay_name(),
                author.getAvatar_image_url(),
                author.getIs_verified(),
                author.getRole()
        );

        List<HashtagPosts> postHashtags = post.getPostHashtags();

        if (postHashtags == null) {
            postHashtags = new ArrayList<>();
        }

        List<String> hashtags = postHashtags.stream()
                .map(hashtagPost -> hashtagPost.getHashtags().getTag())
                .collect(Collectors.toList());

        return new PostResponseDTO(
                post.getId(),
                authorDTO,
                post.getText(),
                hashtags,
                post.getViews_count(),
                post.getLike_count(),
                post.getRepost_off() != null ? getPostResponseDTO(post.getRepost_off()) : null,
                post.getRepost_count(),
                post.getReply_count(),
                post.getIn_reply_to() != null ? getPostResponseDTO(post.getIn_reply_to()) : null,
                post.getCreatedAt().toString(),
                post.getUpdatedAt().toString()
        );
    }

    public ContextResponseDTO getContextResponseDTO(User user) {
        return new ContextResponseDTO(user.getId(),
                                      user.getUsername(),
                                      user.getDisplay_name(),
                                      user.getFull_name(),
                                      user.getBirth_date(),
                                      user.getGender(),
                                      user.getEmail(),
                                      user.getAvatar_image_url(),
                                      user.getCover_image_url(),
                                      user.getBiography(),
                                      user.getWebsite(),
                                      user.getLocation(),
                                      user.getRole(),
                                      user.getIs_verified(),
                                      user.getIs_private(),
                                      user.getFollower_count(),
                                      user.getFollowing_count(),
                                      user.getCreatedAt().toString(),
                                      user.getUpdatedAt().toString());
    }

    public PublicProfileResponseDTO getPublicProfileResponseDTO(User user) {
        return new PublicProfileResponseDTO(user.getId(),
                                            user.getUsername(),
                                            user.getDisplay_name(),
                                            user.getRole().toString(),
                                            user.getAvatar_image_url(),
                                            user.getCover_image_url(),
                                            user.getBiography(),
                                            user.getWebsite(),
                                            user.getLocation(),
                                            user.getIs_verified(),
                                            user.getIs_private(),
                                            Math.toIntExact(user.getFollower_count()),
                                            Math.toIntExact(user.getFollowing_count()),
                                            user.getPosts().size(),
                                            user.getLiked_posts().size(),
                                            user.getCreatedAt().toString(),
                                            user.getUpdatedAt().toString());
    }
}