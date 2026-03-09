package com.danielfreitassc.backend.controllers.module;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danielfreitassc.backend.dtos.module.AuthModuleRequestDto;
import com.danielfreitassc.backend.dtos.user.AuthResponseDto;
import com.danielfreitassc.backend.services.module.AuthModuleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthModuleController {
    private final AuthModuleService authModuleService;

    @PostMapping("/login-modules")
    public AuthResponseDto login(@RequestBody @Valid AuthModuleRequestDto authModuleRequestDto) {
        return authModuleService.login(authModuleRequestDto);
    }  

}
