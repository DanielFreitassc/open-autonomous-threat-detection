package com.danielfreitassc.backend.dtos.anomaly;

import java.time.LocalDateTime;

import com.danielfreitassc.backend.models.anomaly.Severity;

public record AnomalyResponseDto(
    String id,
    String sourceType,
    String host,
    String rule,
    Severity severity,
    String title,
    String description,
    String fullLog,
    LocalDateTime timestamp,
    LocalDateTime createdAt

) {
    
}
