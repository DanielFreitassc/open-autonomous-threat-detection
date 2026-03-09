package com.danielfreitassc.backend.repositories.module;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.danielfreitassc.backend.models.module.ModuleEntity;
import com.danielfreitassc.backend.models.user.UserRole;

public interface ModuleRepository extends JpaRepository<ModuleEntity, UUID> {
    Optional<ModuleEntity> findByUsername(String username);

    @Query("SELECT COUNT(u) FROM UserEntity u WHERE u.role = :role")
    long countByRole(UserRole role);

    boolean existsByUsernameAndIdNot(String username, UUID id);
}
