package com.danielfreitassc.backend.dtos.anomaly;

public record RawLogsResponseDto(
    String id,
    EventsResponseDto event,
    String raw
) {
    
}
