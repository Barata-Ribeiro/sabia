package com.barataribeiro.sabia.service;

import com.barataribeiro.sabia.config.AppConstants;
import com.barataribeiro.sabia.dto.post.PostRequestDTO;
import com.barataribeiro.sabia.dto.post.PostResponseDTO;
import com.barataribeiro.sabia.exceptions.others.BadRequest;
import com.barataribeiro.sabia.exceptions.others.ForbiddenRequest;
import com.barataribeiro.sabia.exceptions.post.PostNotFound;
import com.barataribeiro.sabia.exceptions.user.UserNotFound;
import com.barataribeiro.sabia.model.HashtagPosts;
import com.barataribeiro.sabia.model.entities.Hashtag;
import com.barataribeiro.sabia.model.entities.Like;
import com.barataribeiro.sabia.model.entities.Post;
import com.barataribeiro.sabia.model.entities.User;
import com.barataribeiro.sabia.repository.*;
import com.barataribeiro.sabia.util.EntityMapper;
import com.barataribeiro.sabia.util.Validation;
import lombok.RequiredArgsConstructor;
import org.apache.commons.text.StringEscapeUtils;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class PostService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final LikeRepository likeRepository;
    private final HashtagRepository hashtagRepository;
    private final HashtagPostsRepository hashtagPostsRepository;
    private final Validation validation;
    private final EntityMapper entityMapper;

    public Map<String, Object> getAllPosts(String userId, int page, int perPage, String requestingUser, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        Pageable paging = PageRequest.of(page, perPage);

        String invalidParamsMessage = isEnglishLang
                                      ? "The number of items per page must be between 0 and 15."
                                      : "O número de itens por página deve estar entre 0 e 15.";

        if (perPage < 0 || perPage > 15) {
            throw new BadRequest(invalidParamsMessage);
        }

        Page<Post> postPage = postRepository.findDistinctAllByAuthorIdOrderByCreatedAtDesc(userId, paging);

        return createPostPageResponse(postPage, requestingUser);
    }

    @Transactional
    public PostResponseDTO getPostById(String postId, String requestingUser, String language) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFound(language));

        post.incrementViewCount();
        Post savedPost = postRepository.save(post);

        return entityMapper.getPostResponseDTO(savedPost, requestingUser);
    }

    public Map<String, Object> getPostReplies(String postId, int page, int perPage, String requestingUser, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        Pageable paging = PageRequest.of(page, perPage);

        String invalidParamsMessage = isEnglishLang
                                      ? "The number of items per page must be between 0 and 10."
                                      : "O número de itens por página deve estar entre 0 e 10.";

        if (perPage < 0 || perPage > 10) {
            throw new BadRequest(invalidParamsMessage);
        }

        Page<Post> postPage = postRepository.findRepliesByPostId(postId, paging);

        List<Post> posts = new ArrayList<>(postPage.getContent());

        List<PostResponseDTO> postsDTOs = posts.stream()
                .map(post -> entityMapper.getPostResponseDTO(post, requestingUser))
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("replies", postsDTOs);
        response.put(AppConstants.CURRENT_PAGE, postPage.getNumber());
        response.put(AppConstants.TOTAL_ITEMS, postPage.getTotalElements());
        response.put(AppConstants.TOTAL_PAGES, postPage.getTotalPages());

        return response;
    }

    public Map<String, Object> searchPosts(@NotNull String query, int page, int perPage, String requestingUser, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        Pageable paging = PageRequest.of(page, perPage, Sort.by("createdAt").descending());
        String queryParams = query.startsWith("#") ? query.substring(1) : query;

        String invalidParamsMessage = isEnglishLang
                                      ? "The number of items per page must be between 0 and 15."
                                      : "O número de itens por página deve estar entre 0 e 15.";

        String emptyQueryMessage = isEnglishLang
                                   ? "You must provide a term to search for posts."
                                   : "Você deve fornecer um termo para pesquisar por posts.";


        validation.validateSearchParameters(query, perPage, isEnglishLang, invalidParamsMessage, emptyQueryMessage);


        Page<Post> postPage = query.startsWith("#") ?
                              postRepository.findAllByHashtag(queryParams, paging) :
                              postRepository.findAllByTextContaining(queryParams, paging);

        return createPostPageResponse(postPage, requestingUser);
    }

    public Map<String, Object> getPostsByHashtag(String hashtag, int page, int perPage, String requestingUser, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        Pageable paging = PageRequest.of(page, perPage, Sort.by("createdAt").descending());

        String invalidParamsMessage = isEnglishLang
                                      ? "The number of items per page must be between 0 and 10."
                                      : "O número de itens por página deve estar entre 0 e 10.";

        if (perPage < 0 || perPage > 10) {
            throw new BadRequest(invalidParamsMessage);
        }

        Page<Post> postPage = postRepository.findAllByHashtag(hashtag, paging);

        return createPostPageResponse(postPage, requestingUser);
    }

    public Map<String, Object> getTrendingHashtags() {
        Pageable paging = PageRequest.of(0, 5);

        List<Hashtag> hashtags = hashtagRepository.findTrendingHashtags(paging);

        List<Map<String, Object>> trendingHashtags = hashtags.stream()
                .map(hashtag -> {
                    Map<String, Object> hashtagMap = new HashMap<>();
                    hashtagMap.put("hashtag", hashtag.getTag());
                    hashtagMap.put("total_posts", hashtag.getHashtagPosts().size());
                    hashtagMap.put("created_at", hashtag.getCreatedAt().toString());

                    return hashtagMap;
                })
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("trending_hashtags", trendingHashtags);
        response.put(AppConstants.TOTAL_ITEMS, hashtags.size());

        return response;
    }


    @Transactional
    public PostResponseDTO createPost(PostRequestDTO body, String requestingUser, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        User author = userRepository.findByUsername(requestingUser)
                .orElseThrow(() -> new UserNotFound(language));

        var text = getSanitizedText(body, isEnglishLang);

        Pattern pattern = Pattern.compile("#\\w+");
        Matcher matcher = pattern.matcher(text);

        Post post = Post.builder()
                .author(author)
                .text(text)
                .build();

        Post savedPost = postRepository.save(post);

        while (matcher.find()) {
            String hashtagText = matcher.group().substring(1);
            Hashtag hashtag = hashtagRepository.findByTag(hashtagText)
                    .orElseGet(() -> {
                        Hashtag newHashtag = Hashtag.builder()
                                .tag(hashtagText)
                                .build();

                        return hashtagRepository.save(newHashtag);
                    });

            HashtagPosts hashtagPost = HashtagPosts.builder()
                    .hashtags(hashtag)
                    .posts(savedPost)
                    .build();

            hashtagPostsRepository.save(hashtagPost);

            ArrayList<HashtagPosts> postHashtags = new ArrayList<>(List.of(hashtagPost));

            savedPost.setPostHashtags(postHashtags);
        }

        savedPost = postRepository.save(post);

        return entityMapper.getPostResponseDTO(savedPost, requestingUser);
    }

    @Transactional
    public PostResponseDTO repost(String postId, String requestingUser, String language) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFound(language));

        User user = userRepository.findByUsername(requestingUser)
                .orElseThrow(() -> new UserNotFound(language));

        Post repost = Post.builder()
                .author(user)
                .text(post.getText())
                .repost_off(post)
                .build();

        Post savedRepost = postRepository.save(repost);

        post.incrementRepostCount();
        post.incrementViewCount();

        postRepository.save(post);

        return entityMapper.getPostResponseDTO(savedRepost, requestingUser);
    }

    @Transactional
    public PostResponseDTO replyToPost(String postId, PostRequestDTO body, String requestingUser, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFound(language));

        User user = userRepository.findByUsername(requestingUser)
                .orElseThrow(() -> new UserNotFound(language));

        var text = getSanitizedText(body, isEnglishLang);

        validation.validateBodyText(isEnglishLang, text);

        Post reply = Post.builder()
                .author(user)
                .text(text)
                .in_reply_to(post)
                .build();

        Post savedReply = postRepository.save(reply);

        post.incrementReplyCount();
        postRepository.save(post);

        return entityMapper.getPostResponseDTO(savedReply, requestingUser);
    }

    @Transactional
    public void deletePost(String postId, String requestingUser, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFound(language));

        String notAuthorMessage = isEnglishLang
                                  ? "You are not the author of this post."
                                  : "Você não é o autor deste post.";

        if (!post.getAuthor().getUsername().equals(requestingUser)) {
            throw new ForbiddenRequest(notAuthorMessage);
        }

        postRepository.delete(post);
    }

    @Transactional
    public Boolean toggleLike(String postId, String requestingUser, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFound(language));

        User user = userRepository.findByUsername(requestingUser)
                .orElseThrow(() -> new UserNotFound(language));

        String sameAuthorMessage = isEnglishLang
                                   ? "You cannot like your own post."
                                   : "Você não pode curtir seu próprio post.";

        if (post.getAuthor().getUsername().equals(user.getUsername())) {
            throw new ForbiddenRequest(sameAuthorMessage);
        }

        boolean liked = likeRepository.existsByUser_UsernameAndPostId(requestingUser, postId);

        if (liked) {
            likeRepository.deleteByUserAndPost(user, post);
            post.decrementLikeCount();
        } else {
            Like newLike = Like.builder()
                    .user(user)
                    .post(post)
                    .build();

            likeRepository.save(newLike);
            post.incrementLikeCount();
        }

        postRepository.save(post);

        return !liked;
    }

    private @NotNull Map<String, Object> createPostPageResponse(@NotNull Page<Post> postPage, String requestingUser) {
        List<Post> postsResult = new ArrayList<>(postPage.getContent());

        List<PostResponseDTO> postsDTOs = postsResult.stream()
                .map(post -> entityMapper.getPostResponseDTO(post, requestingUser))
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("posts", postsDTOs);
        response.put(AppConstants.CURRENT_PAGE, postPage.getNumber());
        response.put(AppConstants.TOTAL_ITEMS, postPage.getTotalElements());
        response.put(AppConstants.TOTAL_PAGES, postPage.getTotalPages());

        return response;
    }

    private String getSanitizedText(@NotNull PostRequestDTO body, boolean isEnglishLang) {
        var text = StringEscapeUtils.escapeHtml4(body.text().strip());

        validation.validateBodyText(isEnglishLang, text);
        return text;
    }
}
