package com.danielfreitassc.backend.dtos.anomaly;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record FeaturesRequestDto(
    @NotNull(message = "O ID do evento é obrigatório") String eventId,
    @Min(value = 0, message = "A taxa de requisições não pode ser negativa") float requestRate,
    @Min(value = 0, message = "O número de logins falhos não pode ser negativo") Long failedLoginCount,
    @Min(value = 0, message = "A distância geográfica não pode ser negativa") float geoDistanceKm
) {
    
}
