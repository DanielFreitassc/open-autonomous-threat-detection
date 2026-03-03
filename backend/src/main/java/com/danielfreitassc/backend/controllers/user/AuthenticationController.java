package com.danielfreitassc.backend.controllers.user;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danielfreitassc.backend.dtos.user.LoginRequestDto;
import com.danielfreitassc.backend.dtos.user.LoginResponseDto;
import com.danielfreitassc.backend.services.AuthenticationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth/login")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping
    public LoginResponseDto login(@RequestBody @Valid LoginRequestDto authenticationDto) {
        return authenticationService.login(authenticationDto);
    }
}
