package com.danielfreitassc.backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.danielfreitassc.backend.models.user.UserEntity;
import com.danielfreitassc.backend.models.user.UserRole;
import com.danielfreitassc.backend.repositories.user.UserRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AdminUserInitializer {

    private final UserRepository userRepository;
    private final UserService userService;
    @Value("${user.mock.username}")
    private String adminUsername;

    @Value("${user.mock.password}")
    private String adminPassword;

    @PostConstruct
    public void init() {
        if (!userService.existsByEmail(adminUsername)) {
            String encryptedPassword = new BCryptPasswordEncoder().encode(adminPassword);

            //Conta admin
            UserEntity admin = new UserEntity();
            admin.setName("Administrador");
            admin.setUsername(adminUsername);
            admin.setPassword(encryptedPassword);
            admin.setRole(UserRole.ADMIN);
            userRepository.save(admin);
            
            System.out.println("Admin user created.");
        } else {
            System.out.println("Admin user already exists.");
        }
    }
}
