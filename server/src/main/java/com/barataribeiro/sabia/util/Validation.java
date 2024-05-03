package com.barataribeiro.sabia.util;

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
}
