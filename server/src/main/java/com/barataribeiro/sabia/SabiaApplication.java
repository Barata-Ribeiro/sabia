package com.barataribeiro.sabia;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class SabiaApplication {

    public static void main(String[] args) {
        SpringApplication.run(SabiaApplication.class, args);
    }

}
