package com.barataribeiro.sabia.util;

import com.barataribeiro.sabia.dto.post.PostResponseDTO;
import com.barataribeiro.sabia.dto.user.AuthorResponseDTO;
import com.barataribeiro.sabia.dto.user.PublicProfileResponseDTO;
import com.barataribeiro.sabia.model.HashtagPosts;
import com.barataribeiro.sabia.model.entities.Post;
import com.barataribeiro.sabia.model.entities.User;
import com.barataribeiro.sabia.repository.FollowRepository;
import com.barataribeiro.sabia.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class EntityMapper {
    public final LikeRepository likeRepository;
    public final FollowRepository followRepository;

    public PostResponseDTO getPostResponseDTO(Post post, String requestingUser) {
        User author = post.getAuthor();
        AuthorResponseDTO authorDTO = new AuthorResponseDTO(
                author.getId(),
                author.getUsername(),
                author.getDisplayName(),
                author.getAvatarImageUrl(),
                author.getIsVerified(),
                author.getRole()
        );

        List<HashtagPosts> postHashtags = post.getPostHashtags();

        if (postHashtags == null) {
            postHashtags = new ArrayList<>();
        }

        List<String> hashtags = postHashtags.stream()
                .map(hashtagPost -> hashtagPost.getHashtags().getTag())
                .toList();

        Boolean isLiked = likeRepository.existsByUser_UsernameAndPostId(requestingUser, post.getId());

        return new PostResponseDTO(
                post.getId(),
                authorDTO,
                post.getText(),
                hashtags,
                post.getViewsCount(),
                post.getLikeCount(),
                isLiked,
                post.getRepostOff() != null ? getPostResponseDTO(post.getRepostOff(), requestingUser) : null,
                post.getRepostCount(),
                post.getReplyCount(),
                post.getInReplyTo() != null ? getPostResponseDTO(post.getInReplyTo(), requestingUser) : null,
                post.getCreatedAt().toString(),
                post.getUpdatedAt().toString()
        );
    }

    public PublicProfileResponseDTO getPublicProfileResponseDTO(User user, String requestingUser) {
        boolean isFollowing = followRepository.existsByFollower_UsernameAndFollowed_Username(requestingUser, user.getUsername());

        return new PublicProfileResponseDTO(user.getId(),
                                            user.getUsername(),
                                            user.getDisplayName(),
                                            user.getRole().toString(),
                                            user.getAvatarImageUrl(),
                                            user.getCoverImageUrl(),
                                            user.getBiography(),
                                            user.getWebsite(),
                                            user.getLocation(),
                                            user.getIsVerified(),
                                            user.getIsPrivate(),
                                            isFollowing,
                                            Math.toIntExact(user.getFollowerCount()),
                                            Math.toIntExact(user.getFollowingCount()),
                                            user.getPosts().size(),
                                            user.getLikedPosts().size(),
                                            user.getCreatedAt().toString(),
                                            user.getUpdatedAt().toString());
    }
}
