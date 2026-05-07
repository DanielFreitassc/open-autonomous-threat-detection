package com.danielfreitassc.backend.dtos.anomaly;

import java.util.UUID;

public record SourcersResponseDto(
    UUID id,              
    String service,
    String engine,
    String host,          
    String clientIp,
    String userAgent,
    String location,      
    Double latitude,      
    Double longitude      
) {
    
}