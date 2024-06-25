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
    private String displayName;
    private String fullName;
    private String birthDate;
    private String gender;
    private String email;
    private String password;
    private Roles role;
    private String avatarImageUrl;
    private String coverImageUrl;
    private String biography;
    private String website;
    private String location;
    private Boolean isVerified;
    private Boolean isPrivate;
    private Long followerCount;
    private Long followingCount;
    private Instant createdAt;
    private Instant updatedAt;
}