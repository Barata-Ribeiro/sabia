package com.barataribeiro.sabia.service;

import com.barataribeiro.sabia.exceptions.others.BadRequest;
import com.barataribeiro.sabia.exceptions.others.InternalServerError;
import com.barataribeiro.sabia.exceptions.post.PostNotFound;
import com.barataribeiro.sabia.exceptions.user.UserNotFound;
import com.barataribeiro.sabia.model.Post;
import com.barataribeiro.sabia.model.Roles;
import com.barataribeiro.sabia.model.User;
import com.barataribeiro.sabia.repository.PostRepository;
import com.barataribeiro.sabia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    public Boolean toggleVerifyUser(String userId, String principalName) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFound::new);

        if (user.getUsername().equals(principalName)) throw new BadRequest("You can't verify yourself.");
        if (user.getRole().equals(Roles.ADMIN))
            throw new BadRequest("Admins can't verify other admins. They are already verified.");

        user.setIs_verified(!user.getIs_verified());

        userRepository.save(user);

        return user.getIs_verified();
    }

    public Boolean toggleUserBan(String userId, String principalName) {
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
        try {
            User user = userRepository.findById(userId).orElseThrow(UserNotFound::new);

            if (user.getUsername().equals(principalName))
                throw new BadRequest("To delete your account, use the 'Delete Account' option in the settings.");
            if (user.getRole().equals(Roles.ADMIN))
                throw new BadRequest("Admins can't delete other admins.");

            userRepository.delete(user);
        } catch (Exception error) {
            System.err.println("An error occurred while deleting the user's account: " + error.getMessage());
            throw new InternalServerError("An error occurred while deleting your account. Please try again.");
        }
    }

    @Transactional
    public void deletePost(String postId, String principalName) {
        try {
            Post post = postRepository.findById(postId).orElseThrow(PostNotFound::new);

            if (post.getAuthor().getUsername().equals(principalName))
                throw new BadRequest("To delete your post, use the 'Delete' option in the post itself.");
            if (post.getAuthor().getRole().equals(Roles.ADMIN))
                throw new BadRequest("Admins can't delete other admins' posts.");

            postRepository.delete(post);
        } catch (Exception error) {
            System.err.println("An error occurred while deleting the post: " + error.getMessage());
            throw new InternalServerError("An error occurred while deleting the post. Please try again.");
        }
    }
}
