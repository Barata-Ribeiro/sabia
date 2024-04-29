package com.barataribeiro.sabia.dto.post;

import com.barataribeiro.sabia.dto.user.AuthorResponseDTO;

public record PostResponseDTO (String id,
                               String content,
                               AuthorResponseDTO author,
                               Integer views,
                               String created_at,
                               String updated_at) {
}
