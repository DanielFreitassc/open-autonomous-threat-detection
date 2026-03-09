package com.danielfreitassc.backend.services.module;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.danielfreitassc.backend.dtos.module.AuthModuleRequestDto;
import com.danielfreitassc.backend.dtos.user.AuthResponseDto;
import com.danielfreitassc.backend.infra.security.TokenModuleService;
import com.danielfreitassc.backend.models.module.ModuleEntity;
import com.danielfreitassc.backend.repositories.module.ModuleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor 
public class AuthModuleService {
    private static final int MAX_LOGIN_ATTEMPTS = 4;

    private final PasswordEncoder passwordEncoder;
    private final TokenModuleService tokenModuleService;
    private final ModuleRepository moduleRepository;

    public AuthResponseDto login(AuthModuleRequestDto authModuleRequestDto) {
        ModuleEntity module = findModuleOrThrow(authModuleRequestDto);
        validateModuleStatus(module);

        if (passwordEncoder.matches(authModuleRequestDto.password(), module.getPassword())) {
            module.resetLoginAttempts();
            moduleRepository.save(module);
            String token = tokenModuleService.generateToken(module);
            return new AuthResponseDto(token);
        } else {
            handleFailedLogin(module);
            return null;
        }
    }

    private ModuleEntity findModuleOrThrow(AuthModuleRequestDto authModuleRequestDto) {
        return moduleRepository.findByUsername(authModuleRequestDto.username())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Username ou senha inválidos."));
    }

    private void validateModuleStatus(ModuleEntity moduleEntity) {
        if (moduleEntity.isAccountLocked()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"A conta está bloqueada. Tente novamente mais tarde.");
        }

        if (!moduleEntity.isActive()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Sua conta ainda não está ativada.");
        }
    }

    private void handleFailedLogin(ModuleEntity moduleEntity) {
        moduleEntity.incrementLoginAttempts();

        if (moduleEntity.getLoginAttempts() >= MAX_LOGIN_ATTEMPTS) {
            moduleEntity.lockAccount();
        }

        moduleRepository.save(moduleEntity);

        if (moduleEntity.isAccountLocked()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Conta bloqueada por excesso de tentativas.");
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"E-mail ou senha inválidos.");
        }
    }
}
