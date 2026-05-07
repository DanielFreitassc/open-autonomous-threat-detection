package com.danielfreitassc.backend.dtos.anomaly;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

public record HttpRequestsRequestDto(
    @NotBlank(message = "O método HTTP é obrigatório") String method,
    @NotBlank(message = "O endpoint é obrigatório") String endpoint,
    @PositiveOrZero(message = "O código de status não pode ser negativo") int statusCode,
    @NotBlank(message = "O protocolo é obrigatório") String protocol
) {
    
}
