package com.danielfreitassc.backend.dtos.user;

import java.time.LocalDateTime;
import java.util.UUID;

import com.danielfreitassc.backend.models.user.UserRole;

public record UserResponseDto(
    UUID id,
    String name,
    String email,
    UserRole role,
    boolean active,
    LocalDateTime createdAt
) {
    
}