package com.danielfreitassc.backend.dtos.anomaly;

public record SourcersResponseDto(
    String id,
    EventsResponseDto event,
    String service,
    String engine,
    String host,
    String clientIp,
    String userAgent
) {
    
}
