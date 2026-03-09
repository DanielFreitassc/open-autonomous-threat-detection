package com.danielfreitassc.backend.dtos.anomaly;

import java.time.LocalDateTime;
import java.util.UUID;

public record AnomalyResponseDto(
    UUID id,
    String sourceType,
    String host,
    String rule,
    String severity,
    String title,
    String description,
    String fullLog,
    LocalDateTime timestamp,
    LocalDateTime createdAt    
) {
    
}
