package com.danielfreitassc.backend.dtos.anomaly;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

import com.danielfreitassc.backend.models.anomaly.Severity;

public record AnomalyRequestDto(

    @NotNull(message = "Timestamp é obrigatório")
    LocalDateTime timestamp,

    @NotBlank(message = "Source é obrigatório")
    @Size(max = 50, message = "Source deve ter no máximo 50 caracteres")
    String sourceType,

    @NotBlank(message = "Host é obrigatório")
    @Size(max = 100, message = "Host deve ter no máximo 100 caracteres")
    String host,

    @NotBlank(message = "Rule é obrigatória")
    @Size(max = 100, message = "Rule deve ter no máximo 100 caracteres")
    String rule,

    @NotNull(message = "Severity é obrigatória")
    Severity severity,
    
    @NotBlank(message = "Title é obrigatório")
    @Size(max = 50, message = "Title deve ter no máximo 50 caracteres")
    String title,
    
    @NotBlank(message = "Title é obrigatório")
    @Size(max = 50, message = "Title deve ter no máximo 50 caracteres")
    String description,

    @NotBlank(message = "Full log é obrigatório")
    @Size(max = 10000, message = "Full log muito grande")
    String fullLog

) {}
