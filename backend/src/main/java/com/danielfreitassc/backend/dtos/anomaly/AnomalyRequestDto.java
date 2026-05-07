package com.danielfreitassc.backend.dtos.anomaly;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

import com.danielfreitassc.backend.models.anomaly.Severity;

public record AnomalyRequestDto(

    @NotBlank(message = "A regra é obrigatória") String rule,
    @NotNull(message = "A severidade é obrigatória") Severity severity,
    @NotBlank(message = "O título é obrigatório") String title,
    @Size(max = 10000, message = "A descrição deve ter no máximo 10000 caracteres") String description,
    @Size(max = 20000, message = "O log completo deve ter no máximo 20000 caracteres") String fullLog,
    @NotNull(message = "O timestamp é obrigatório") LocalDateTime timestamp

) {}
