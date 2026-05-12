package com.danielfreitassc.backend.dtos.whitelist;

import java.util.UUID;

public record WhitelistResponseDto(
    UUID id,
    String endpoint,
    String statusCode,
    String bodySize
) {
    
}
