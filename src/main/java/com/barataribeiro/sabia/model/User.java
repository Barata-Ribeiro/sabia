package com.barataribeiro.sabia.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false)
    private String id;

    @NonNull
    private String username;

    @NonNull
    private String display_name;

    @NonNull
    private String email;

    @NonNull
    private String password;

    @Enumerated(EnumType.STRING)
    private Roles role = Roles.MEMBER;

    private String avatar_url;
    private String cover_url;
    private String biography;
    private Boolean is_verified = false;
}
