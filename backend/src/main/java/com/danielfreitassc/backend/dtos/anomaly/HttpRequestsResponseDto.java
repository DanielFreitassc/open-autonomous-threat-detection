package com.danielfreitassc.backend.dtos.anomaly;

public record HttpRequestsResponseDto(
    String id,
    EventsResponseDto event,
    String method,
    String endpoint,
    int statusCode,
    String protocol
) {
    
}
