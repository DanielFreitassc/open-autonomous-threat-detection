package com.danielfreitassc.backend.dtos.module;

import java.time.LocalDateTime;
import java.util.UUID;

public record ModuleResponseDto(
    UUID id,
    String name,
    String username,
    boolean active,
    LocalDateTime createdAt
) {
    
}
