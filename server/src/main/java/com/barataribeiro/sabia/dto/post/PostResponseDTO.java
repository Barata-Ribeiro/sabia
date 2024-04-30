package com.barataribeiro.sabia.dto.post;

import com.barataribeiro.sabia.dto.user.AuthorResponseDTO;

public record PostResponseDTO(String id,
                              AuthorResponseDTO author,
                              String text,
                              Integer views,
                              Long repost_count,
                              Long like_count,
                              String created_at,
                              String updated_at) {
}
