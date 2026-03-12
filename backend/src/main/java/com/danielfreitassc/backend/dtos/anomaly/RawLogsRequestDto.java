package com.danielfreitassc.backend.dtos.anomaly;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RawLogsRequestDto(
    @NotNull(message = "O ID do evento é obrigatório") String eventId,
    @NotBlank(message = "O log bruto é obrigatório") 
    @Size(max = 50000, message = "O log bruto deve ter no máximo 50000 caracteres") String raw
) {
    
}
