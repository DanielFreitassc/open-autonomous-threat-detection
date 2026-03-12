package com.danielfreitassc.backend.dtos.anomaly;

import java.time.LocalDateTime;

public record EventsResponseDto(
    String id,
    LocalDateTime timestamp,
    String category,
    String type,
    String outcome
) {
    
}
