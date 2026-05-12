package com.danielfreitassc.backend.dtos.anomaly;

import jakarta.validation.constraints.NotBlank;

public record HttpRequestsRequestDto(
    @NotBlank(message = "O método HTTP é obrigatório") String method,
    @NotBlank(message = "O endpoint é obrigatório") String endpoint,
    @NotBlank(message = "O status code é obrigatório") String statusCode,
    @NotBlank(message = "O tamanho é obrigatório") String bodySize,
    @NotBlank(message = "O protocolo é obrigatório") String protocol
) {
    
}
