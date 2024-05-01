package com.barataribeiro.sabia.service.user;

import com.barataribeiro.sabia.dto.user.ContextResponseDTO;
import com.barataribeiro.sabia.exceptions.others.ForbiddenRequest;
import com.barataribeiro.sabia.exceptions.user.UserNotFound;
import com.barataribeiro.sabia.model.User;
import com.barataribeiro.sabia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public ContextResponseDTO getUserContext(String userId, String requesting_user) {
        User user = userRepository.findById(userId)
                .orElseThrow(UserNotFound::new);

        if (!Objects.equals(user.getUsername(), requesting_user)) {
            throw new ForbiddenRequest("You are not allowed to access this user's information.");
        }

        return new ContextResponseDTO(user.getId(),
                                      user.getUsername(),
                                      user.getDisplay_name(),
                                      user.getEmail(),
                                      user.getAvatar_image_url(),
                                      user.getCover_image_url(),
                                      user.getBiography(),
                                      user.getWebsite(),
                                      user.getLocation(),
                                      user.getRole(),
                                      user.getIs_verified(),
                                      user.getIs_private(),
                                      user.getFollower_count(),
                                      user.getFollowing_count(),
                                      user.getCreated_at().toString(),
                                      user.getUpdated_at().toString());
    }
}


