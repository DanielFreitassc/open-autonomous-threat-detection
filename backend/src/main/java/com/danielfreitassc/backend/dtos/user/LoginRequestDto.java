package com.danielfreitassc.backend.dtos.user;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDto(
    @NotBlank(message = "Username não pode estar vazio")
    String username,
    @NotBlank(message = "Senha não pode estar vazia")
    String password
) {
    
}