package com.danielfreitassc.backend.repositories.user;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.danielfreitassc.backend.models.user.UserEntity;
import com.danielfreitassc.backend.models.user.UserRole;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByUsername(String username);

    @Query("SELECT COUNT(u) FROM users u WHERE u.role = :role")
    long countByRole(UserRole role);
}