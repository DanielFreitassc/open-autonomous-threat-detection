package com.danielfreitassc.backend.controllers.user;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danielfreitassc.backend.dtos.user.AuthRequestDto;
import com.danielfreitassc.backend.dtos.user.AuthResponseDto;
import com.danielfreitassc.backend.dtos.user.UserResponseDto;
import com.danielfreitassc.backend.models.user.UserEntity;
import com.danielfreitassc.backend.services.AuthMeService;
import com.danielfreitassc.backend.services.AuthenticationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final AuthMeService authMeService;

    @PostMapping("/login")
    public AuthResponseDto login(@RequestBody @Valid AuthRequestDto authRequestDto) {
        return authenticationService.login(authRequestDto);
    }  

    @GetMapping("/me")
    public UserResponseDto auth(@AuthenticationPrincipal UserEntity userEntity) {
        return authMeService.auth(userEntity);
    }
}
