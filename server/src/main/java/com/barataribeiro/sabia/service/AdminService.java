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

    public Boolean toggleVerifyUser(String userId, String principalName, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFound(language));

        String sameUserBadRequestMessage = isEnglishLang
                                           ? "You can't verify yourself."
                                           : "Você não pode verificar a si mesmo.";

        String userIsAdminBadRequestMessage = isEnglishLang
                                              ? "Admins can't verify other admins. They are already verified."
                                              : "Os administradores não podem verificar outros administradores. Eles já estão verificados.";

        if (user.getUsername().equals(principalName)) {
            throw new BadRequest(sameUserBadRequestMessage);
        }

        if (user.getRole().equals(Roles.ADMIN)) {
            throw new BadRequest(userIsAdminBadRequestMessage);
        }

        user.setIs_verified(!user.getIs_verified());

        userRepository.save(user);

        return user.getIs_verified();
    }

    public Boolean toggleUserBan(String userId, String principalName, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFound(language));

        String sameUserBadRequestMessage = isEnglishLang
                                           ? "You can't ban yourself."
                                           : "Você não pode banir a si mesmo.";

        String userIsAdminBadRequestMessage = isEnglishLang
                                              ? "Admins can't ban other admins."
                                              : "Os administradores não podem banir outros administradores.";

        if (user.getUsername().equals(principalName)) {
            throw new BadRequest(sameUserBadRequestMessage);
        }

        if (user.getRole().equals(Roles.ADMIN)) {
            throw new BadRequest(userIsAdminBadRequestMessage);
        }

        user.setRole(user.getRole().equals(Roles.BANNED) ? Roles.MEMBER : Roles.BANNED);

        userRepository.save(user);

        return user.getRole().equals(Roles.BANNED);
    }

    @Transactional
    public void deleteUser(String userId, String principalName, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        String genericErrorMessage = isEnglishLang
                                     ? "An error occurred while deleting the user's account. Please try again."
                                     : "Ocorreu um erro ao excluir a conta do usuário. Por favor, tente novamente.";
        try {

            User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFound(language));

            String sameUserBadRequestMessage = isEnglishLang
                                               ? "To delete your account, use the 'Delete Account' option in the settings."
                                               : "Para excluir sua conta, use a opção 'Excluir conta' nas configurações.";

            String userIsAdminBadRequestMessage = isEnglishLang
                                                  ? "Admins can't delete other admins."
                                                  : "Os administradores não podem excluir outros administradores.";

            if (user.getUsername().equals(principalName)) {
                throw new BadRequest(sameUserBadRequestMessage);
            }

            if (user.getRole().equals(Roles.ADMIN)) {
                throw new BadRequest(userIsAdminBadRequestMessage);
            }

            userRepository.delete(user);
        } catch (Exception error) {
            System.err.println("An error occurred while deleting the user's account: " + error.getMessage());
            throw new InternalServerError(genericErrorMessage);
        }
    }

    @Transactional
    public void deletePost(String postId, String principalName, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        String genericErrorMessage = isEnglishLang
                                     ? "An error occurred while deleting the post. Please try again."
                                     : "Ocorreu um erro ao excluir a postagem. Por favor, tente novamente.";

        try {
            Post post = postRepository.findById(postId).orElseThrow(() -> new PostNotFound(language));

            String sameUserBadRequestMessage = isEnglishLang
                                               ? "To delete your post, use the 'Delete' option in the post itself."
                                               : "Para excluir sua postagem, use a opção 'Excluir' na própria postagem.";

            String userIsAdminBadRequestMessage = isEnglishLang
                                                  ? "Admins can't delete other admins' posts."
                                                  : "Os administradores não podem excluir postagens de outros administradores.";

            if (post.getAuthor().getUsername().equals(principalName)) {
                throw new BadRequest(sameUserBadRequestMessage);
            }

            if (post.getAuthor().getRole().equals(Roles.ADMIN)) {
                throw new BadRequest(userIsAdminBadRequestMessage);
            }

            postRepository.delete(post);
        } catch (Exception error) {
            System.err.println("An error occurred while deleting the post: " + error.getMessage());
            throw new InternalServerError(genericErrorMessage);
        }
    }
}
