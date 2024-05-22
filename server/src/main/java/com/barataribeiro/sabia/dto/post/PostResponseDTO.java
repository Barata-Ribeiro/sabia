package com.barataribeiro.sabia.dto.post;

import com.barataribeiro.sabia.dto.user.AuthorResponseDTO;

import java.util.List;

public record PostResponseDTO(String id,
                              AuthorResponseDTO author,
                              String text,
                              List<String> hashtags,
                              Long views_count,
                              Long like_count,
                              PostResponseDTO repost_off,
                              Long repost_count,
                              Long reply_count,
                              PostResponseDTO in_reply_to,
                              String created_at,
                              String updated_at) {
}
