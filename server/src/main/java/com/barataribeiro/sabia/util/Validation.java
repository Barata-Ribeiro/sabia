package com.barataribeiro.sabia.util;

import com.barataribeiro.sabia.exceptions.others.BadRequest;
import com.barataribeiro.sabia.exceptions.post.PostInvalidBody;
import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class Validation {
    public boolean isEmailValid(String emailToValidate) {
        Pattern regexPattern = Pattern.compile("^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@"
                                                       + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$");

        Matcher matcher = regexPattern.matcher(emailToValidate);

        return !matcher.matches();
    }

    public boolean isPasswordValid(String passwordToValidate) {
        Pattern regexPattern = Pattern.compile("^(?=.*\\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$");
        Matcher matcher = regexPattern.matcher(passwordToValidate);

        return !matcher.matches();
    }

    public void validateSearchParameters(String query, int perPage, boolean isEnglishLang, String invalidParamsMessage,
                                         String emptyQueryMessage) {
        String shortQueryMessage = isEnglishLang
                                   ? "The search term must be at least 3 characters long."
                                   : "O termo de pesquisa deve ter pelo menos 3 caracteres.";

        if (perPage < 0 || perPage > 15) {
            throw new BadRequest(invalidParamsMessage);
        }

        if (query.isEmpty()) {
            throw new BadRequest(emptyQueryMessage);
        }

        if (query.length() < 3) {
            throw new BadRequest(shortQueryMessage);
        }
    }

    public void validateBodyText(boolean isEnglishLang, String text) {
        String emptyPostMessage = isEnglishLang
                                  ? "Text cannot be empty."
                                  : "O texto não pode estar vazio.";

        String invalidPostMessage = isEnglishLang
                                    ? "Text cannot exceed 280 characters."
                                    : "O texto não pode exceder 280 caracteres.";

        if (text.isEmpty()) {
            throw new PostInvalidBody(emptyPostMessage);
        }

        if (text.length() > 280) {
            throw new PostInvalidBody(invalidPostMessage);
        }
    }
}
