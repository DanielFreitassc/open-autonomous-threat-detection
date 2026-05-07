package com.danielfreitassc.backend.dtos.anomaly;

public record HttpRequestsResponseDto(
    String id,
    String method,
    String endpoint,
    int statusCode,
    String protocol
) {
    
}
