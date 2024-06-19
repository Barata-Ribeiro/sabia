package com.barataribeiro.sabia.dto.user;

import com.barataribeiro.sabia.model.enums.Roles;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.barataribeiro.sabia.model.entities.User}
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserDTO implements Serializable {
    private String id;
    private String username;
    private String display_name;
    private String full_name;
    private String birth_date;
    private String gender;
    private String email;
    private String password;
    private Roles role;
    private String avatar_image_url;
    private String cover_image_url;
    private String biography;
    private String website;
    private String location;
    private Boolean is_verified;
    private Boolean is_private;
    private Long follower_count;
    private Long following_count;
    private Instant createdAt;
    private Instant updatedAt;
}