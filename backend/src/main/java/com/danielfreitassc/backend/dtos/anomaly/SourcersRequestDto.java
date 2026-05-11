package com.danielfreitassc.backend.dtos.anomaly;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SourcersRequestDto(
    @NotBlank(message = "O serviço é obrigatório") String service,
    @NotBlank(message = "O engine é obrigatório") String engine,
    
    @NotBlank(message = "O host é obrigatório") String host, 
    
    @NotBlank(message = "O IP do cliente é obrigatório") String clientIp,
    
    @NotBlank(message = "O user agent é obrigatório") 
    @Size(max = 2000, message = "O user agent deve ter no máximo 2000 caracteres") String userAgent
) {
    
}