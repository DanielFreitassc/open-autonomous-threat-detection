package com.danielfreitassc.backend.dtos.whitelist;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record WhitelistRequestDto(

    @NotNull(message = "ID do evento é necessário.")
    UUID eventId,
    @NotBlank(message = "Endpoint é necessária.")
    String endpoint,
    @NotBlank(message = "Status é necessário.")
    String statusCode,
    @NotBlank(message = "Tamanho é necessário.")
    String bodySize
) {
    
}
