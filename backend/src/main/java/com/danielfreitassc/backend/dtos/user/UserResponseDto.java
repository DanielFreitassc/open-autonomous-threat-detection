package com.danielfreitassc.backend.dtos.user;

import java.time.LocalDateTime;
import java.util.UUID;

import com.danielfreitassc.backend.models.user.UserRole;

import com.fasterxml.jackson.annotation.JsonFormat;

public record UserResponseDto(
    UUID id,
    String name,
    String username, 
    String email,
    UserRole role,
    boolean active,
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    LocalDateTime createdAt
) {
    
}