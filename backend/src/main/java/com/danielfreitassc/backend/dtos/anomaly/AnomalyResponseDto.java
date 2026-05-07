package com.danielfreitassc.backend.dtos.anomaly;

import java.time.LocalDateTime;

import com.danielfreitassc.backend.models.anomaly.Severity;

public record AnomalyResponseDto(
    String id,
    String rule,
    Severity severity,
    String title,
    String description,
    LocalDateTime timestamp,
    LocalDateTime createdAt

) {
    
}
