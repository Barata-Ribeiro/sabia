package com.barataribeiro.sabia.service;

import com.barataribeiro.sabia.dto.admin.AdminEditProfileRequestDTO;
import com.barataribeiro.sabia.dto.user.PublicProfileResponseDTO;
import com.barataribeiro.sabia.exceptions.others.BadRequest;
import com.barataribeiro.sabia.exceptions.user.UserNotFound;
import com.barataribeiro.sabia.model.Roles;
import com.barataribeiro.sabia.model.User;
import com.barataribeiro.sabia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public PublicProfileResponseDTO updateUserProfile(String userId, AdminEditProfileRequestDTO body, String principalName) {
        return null;
    }

    public Boolean toggleVerifyUser(String userId, String principalName) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFound::new);

        if (user.getUsername().equals(principalName)) throw new BadRequest("You can't verify yourself.");
        if (user.getRole().equals(Roles.ADMIN))
            throw new BadRequest("Admins can't verify other admins. They are already verified.");

        user.setIs_verified(!user.getIs_verified());

        userRepository.save(user);

        return user.getIs_verified();
    }

    public Boolean banUser(String userId, String principalName) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFound::new);

        if (user.getUsername().equals(principalName)) throw new BadRequest("You can't ban yourself.");
        if (user.getRole().equals(Roles.ADMIN))
            throw new BadRequest("Admins can't ban other admins.");

        user.setRole(user.getRole().equals(Roles.BANNED) ? Roles.MEMBER : Roles.BANNED);

        userRepository.save(user);

        return user.getRole().equals(Roles.BANNED);
    }

    @Transactional
    public void deleteUser(String userId, String principalName) {
    }
}
