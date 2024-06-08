package com.barataribeiro.sabia.service;

import com.barataribeiro.sabia.dto.post.PostRequestDTO;
import com.barataribeiro.sabia.dto.post.PostResponseDTO;
import com.barataribeiro.sabia.exceptions.others.BadRequest;
import com.barataribeiro.sabia.exceptions.others.ForbiddenRequest;
import com.barataribeiro.sabia.exceptions.post.PostNotFound;
import com.barataribeiro.sabia.exceptions.user.UserNotFound;
import com.barataribeiro.sabia.model.*;
import com.barataribeiro.sabia.repository.*;
import com.barataribeiro.sabia.util.EntityMapper;
import com.barataribeiro.sabia.util.Validation;
import lombok.RequiredArgsConstructor;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
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
import java.util.stream.Collectors;

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

    @Cacheable(value = "posts", key = "{#userId, #page, #perPage, #requesting_user, #language}")
    public Map<String, Object> getAllPosts(String userId, int page, int perPage, String requesting_user, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        Pageable paging = PageRequest.of(page, perPage, Sort.by("createdAt").descending());

        String invalidParamsMessage = isEnglishLang
                                      ? "The number of items per page must be between 0 and 15."
                                      : "O número de itens por página deve estar entre 0 e 15.";

        if (perPage < 0 || perPage > 15) {
            throw new BadRequest(invalidParamsMessage);
        }

        Page<Post> postPage = postRepository.findDistinctAllByAuthorId(userId, paging);

        return createPostPageResponse(postPage, requesting_user);
    }

    @Cacheable(value = "post", key = "{#postId, #requesting_user, #language}")
    public PostResponseDTO getPostById(String postId, String requesting_user, String language) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFound(language));

        post.incrementViewCount();
        post = postRepository.saveAndFlush(post);

        return entityMapper.getPostResponseDTO(post, requesting_user);
    }

    @Cacheable(value = "posts", key = "{#postId, #page, #perPage, #requesting_user, #language}")
    public Map<String, Object> getPostReplies(String postId, int page, int perPage, String requesting_user, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        Pageable paging = PageRequest.of(page, perPage, Sort.by("createdAt").descending());

        String invalidParamsMessage = isEnglishLang
                                      ? "The number of items per page must be between 0 and 10."
                                      : "O número de itens por página deve estar entre 0 e 10.";

        if (perPage < 0 || perPage > 10) {
            throw new BadRequest(invalidParamsMessage);
        }

        Page<Post> postPage = postRepository.findRepliesByPostId(postId, paging);

        List<Post> posts = new ArrayList<>(postPage.getContent());

        List<PostResponseDTO> postsDTOs = posts.stream()
                .map(post -> entityMapper.getPostResponseDTO(post, requesting_user))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("replies", postsDTOs);
        response.put("current_page", postPage.getNumber());
        response.put("total_items", postPage.getTotalElements());
        response.put("total_pages", postPage.getTotalPages());

        return response;
    }

    @Cacheable(value = "posts", key = "{#query, #page, #perPage, #requesting_user, #language}")
    public Map<String, Object> searchPosts(String query, int page, int perPage, String requesting_user, String language) {
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

        return createPostPageResponse(postPage, requesting_user);
    }

    @Cacheable(value = "posts", key = "{#hashtag, #page, #perPage, #requesting_user, #language}")
    public Map<String, Object> getPostsByHashtag(String hashtag, int page, int perPage, String requesting_user, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        Pageable paging = PageRequest.of(page, perPage, Sort.by("createdAt").descending());

        String invalidParamsMessage = isEnglishLang
                                      ? "The number of items per page must be between 0 and 10."
                                      : "O número de itens por página deve estar entre 0 e 10.";

        if (perPage < 0 || perPage > 10) {
            throw new BadRequest(invalidParamsMessage);
        }

        Page<Post> postPage = postRepository.findAllByHashtag(hashtag, paging);

        return createPostPageResponse(postPage, requesting_user);
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
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("trending_hashtags", trendingHashtags);
        response.put("total_items", hashtags.size());

        return response;
    }


    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "posts", allEntries = true),
            @CacheEvict(value = "post", allEntries = true),
            @CacheEvict(value = "userPublicProfile", allEntries = true),
            @CacheEvict(value = "userContext", allEntries = true),
            @CacheEvict(value = "userFeed", allEntries = true)
    })
    public PostResponseDTO createPost(PostRequestDTO body, String requesting_user, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        User author = userRepository.findByUsername(requesting_user)
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

        savedPost = postRepository.saveAndFlush(post);

        return entityMapper.getPostResponseDTO(savedPost, requesting_user);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "posts", allEntries = true),
            @CacheEvict(value = "post", allEntries = true),
            @CacheEvict(value = "userPublicProfile", allEntries = true),
            @CacheEvict(value = "userContext", allEntries = true),
            @CacheEvict(value = "userFeed", allEntries = true)
    })
    public PostResponseDTO repost(String postId, String requesting_user, String language) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFound(language));

        User user = userRepository.findByUsername(requesting_user)
                .orElseThrow(() -> new UserNotFound(language));

        Post repost = Post.builder()
                .author(user)
                .text(post.getText())
                .repost_off(post)
                .build();

        repost = postRepository.saveAndFlush(repost);

        post.incrementRepostCount();
        post.incrementViewCount();

        postRepository.save(post);

        return entityMapper.getPostResponseDTO(repost, requesting_user);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "posts", allEntries = true),
            @CacheEvict(value = "post", allEntries = true),
            @CacheEvict(value = "userPublicProfile", allEntries = true),
            @CacheEvict(value = "userContext", allEntries = true),
            @CacheEvict(value = "userFeed", allEntries = true)
    })
    public PostResponseDTO replyToPost(String postId, PostRequestDTO body, String requesting_user, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFound(language));

        User user = userRepository.findByUsername(requesting_user)
                .orElseThrow(() -> new UserNotFound(language));

        var text = getSanitizedText(body, isEnglishLang);

        validation.validateBodyText(isEnglishLang, text);

        Post reply = Post.builder()
                .author(user)
                .text(text)
                .in_reply_to(post)
                .build();

        reply = postRepository.saveAndFlush(reply);

        post.incrementReplyCount();
        postRepository.save(post);

        return entityMapper.getPostResponseDTO(reply, requesting_user);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "posts", allEntries = true),
            @CacheEvict(value = "userFeed", allEntries = true)
    })
    public void deletePost(String postId, String requesting_user, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFound(language));

        String notAuthorMessage = isEnglishLang
                                  ? "You are not the author of this post."
                                  : "Você não é o autor deste post.";

        if (!post.getAuthor().getUsername().equals(requesting_user)) {
            throw new ForbiddenRequest(notAuthorMessage);
        }


        postRepository.delete(post);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "posts", allEntries = true),
            @CacheEvict(value = "post", allEntries = true),
            @CacheEvict(value = "userPublicProfile", allEntries = true),
            @CacheEvict(value = "userContext", allEntries = true),
            @CacheEvict(value = "userFeed", allEntries = true),
            @CacheEvict(value = "userPublicFeed", allEntries = true)
    })
    public Boolean toggleLike(String postId, String requesting_user, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFound(language));

        User user = userRepository.findByUsername(requesting_user)
                .orElseThrow(() -> new UserNotFound(language));

        String sameAuthorMessage = isEnglishLang
                                   ? "You cannot like your own post."
                                   : "Você não pode curtir seu próprio post.";

        if (post.getAuthor().getUsername().equals(user.getUsername())) {
            throw new ForbiddenRequest(sameAuthorMessage);
        }

        boolean liked = likeRepository.existsByUser_UsernameAndPostId(requesting_user, postId);

        if (liked) {
            likeRepository.deleteByUserAndPost(user, post);
            post.decrementLikeCount();
        } else {
            Like newLike = Like.builder()
                    .user(user)
                    .post(post)
                    .build();

            likeRepository.saveAndFlush(newLike);
            post.incrementLikeCount();
        }

        postRepository.saveAndFlush(post);

        return !liked;
    }

    private Map<String, Object> createPostPageResponse(Page<Post> postPage, String requesting_user) {
        List<Post> postsResult = new ArrayList<>(postPage.getContent());

        List<PostResponseDTO> postsDTOs = postsResult.stream()
                .map(post -> entityMapper.getPostResponseDTO(post, requesting_user))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("posts", postsDTOs);
        response.put("current_page", postPage.getNumber());
        response.put("total_items", postPage.getTotalElements());
        response.put("total_pages", postPage.getTotalPages());

        return response;
    }

    private String getSanitizedText(PostRequestDTO body, boolean isEnglishLang) {
        var text = StringEscapeUtils.escapeHtml4(body.text().strip());

        validation.validateBodyText(isEnglishLang, text);
        return text;
    }
}
