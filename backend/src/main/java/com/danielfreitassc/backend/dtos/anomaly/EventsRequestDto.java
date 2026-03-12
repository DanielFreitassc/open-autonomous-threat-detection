package com.danielfreitassc.backend.dtos.anomaly;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EventsRequestDto(
    @NotNull(message = "O timestamp é obrigatório") LocalDateTime timestamp,
    @NotBlank(message = "A categoria é obrigatória") String category,
    @NotBlank(message = "O tipo é obrigatório") String type,
    @NotBlank(message = "O resultado é obrigatório") String outcome
) {
    
}
