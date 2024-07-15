package com.barataribeiro.sabia.dto.post;

import com.barataribeiro.sabia.dto.user.AuthorResponseDTO;

import java.io.Serializable;
import java.util.List;

public record PostResponseDTO(String id,
                              AuthorResponseDTO author,
                              String text,
                              List<String> hashtags,
                              Long viewsCount,
                              Long likeCount,
                              Boolean isLiked,
                              PostResponseDTO repostOff,
                              Long repostCount,
                              Long replyCount,
                              PostResponseDTO inReplyTo,
                              String createdAt,
                              String updatedAt) implements Serializable {
}
