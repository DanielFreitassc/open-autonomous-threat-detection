package com.danielfreitassc.backend.dtos.anomaly;

import java.sql.Timestamp;

public record EventStatsCountResponseDto(
    Timestamp timestamp,
    int critical,
    int high,
    int medium,
    int low
) {
    
}
