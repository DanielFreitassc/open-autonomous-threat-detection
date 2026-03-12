package com.danielfreitassc.backend.dtos.anomaly;

public record FeaturesResponseDto(
    String id,
    EventsResponseDto event,
    float requestRate,
    Long failedLoginCount,
    float geoDistanceKm
) {
    
}
