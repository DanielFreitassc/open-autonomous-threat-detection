package com.danielfreitassc.backend.dtos.anomaly;

public record HttpRequestsResponseDto(
    String id,
    String method,
    String endpoint,
    String statusCode,
    String bodySize,
    String protocol
) {
    
}
