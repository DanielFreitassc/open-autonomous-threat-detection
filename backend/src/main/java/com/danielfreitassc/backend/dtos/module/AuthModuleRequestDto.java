package com.danielfreitassc.backend.dtos.module;

import com.danielfreitassc.backend.configurations.OnCreate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record AuthModuleRequestDto(
    @NotBlank(message = "Email é necessário")
    @Pattern(groups = OnCreate.class, regexp = "^(?=.*@)(?=.*\\.).+$", message = "Email deve conter '@' e '.'")
    String username,
    @NotBlank(message = "Senha é necessária")
    String password
) {
    
}
