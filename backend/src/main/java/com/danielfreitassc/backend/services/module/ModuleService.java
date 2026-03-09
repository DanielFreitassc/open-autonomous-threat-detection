package com.danielfreitassc.backend.services.module;

 import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.danielfreitassc.backend.dtos.common.MessageResponseDto;
import com.danielfreitassc.backend.dtos.module.ModuleRequestDto;
import com.danielfreitassc.backend.dtos.module.ModuleResponseDto;
import com.danielfreitassc.backend.mappers.module.ModuleMapper;
import com.danielfreitassc.backend.models.module.ModuleEntity;
import com.danielfreitassc.backend.models.module.ModuleRole;
import com.danielfreitassc.backend.repositories.module.ModuleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ModuleService {
    private final ModuleRepository moduleRepository;
    private final ModuleMapper moduleMapper;
    private final PasswordEncoder passwordEncoder;

    public ModuleResponseDto create(ModuleRequestDto moduleRequestDto) {
        if (existsByUsername(moduleRequestDto.username())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Conta de serviço já cadastrado");
        }
        
        ModuleEntity moduleEntity = moduleMapper.dtoToEntity(moduleRequestDto);
        moduleEntity.setPassword(passwordEncoder.encode(moduleRequestDto.password()));

        moduleEntity.setRole(ModuleRole.MODULE);
        moduleRepository.save(moduleEntity);
        return moduleMapper.entityToDto(moduleEntity);
    } 

    public Page<ModuleResponseDto> getAll(Pageable pageable) {
        return moduleRepository.findAll(pageable).map(moduleMapper::entityToDto);
    }
    
    public ModuleResponseDto getModule(UUID id) {
        return moduleMapper.entityToDto(findModuleOrThrow(id));
    }

    public MessageResponseDto update(UUID id, ModuleRequestDto moduleRequestDto) {
        ModuleEntity moduleEntity = findModuleOrThrow(id);

        if (moduleRequestDto.username() != null && !moduleRequestDto.username().isBlank()) {
            if (moduleRepository.existsByUsernameAndIdNot(moduleRequestDto.username(), id)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Este username já está em uso por outro usuário");
            }

            moduleEntity.setUsername(moduleRequestDto.username());
        }

        if (moduleRequestDto.name() != null && !moduleRequestDto.name().isBlank()) {
            moduleEntity.setName(moduleRequestDto.name());
        }

        if (moduleRequestDto.password() != null && !moduleRequestDto.password().isBlank()) {
            if (!moduleRequestDto.password().matches("^(?=.*[a-z])(?=.*[A-Z]).{10,}$")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tente uma senha mais forte com 10 caracteres com letra maiúscula e uma letra minúscula.");
            }

            moduleEntity.setPassword(passwordEncoder.encode(moduleRequestDto.password()));
        }

        moduleRepository.save(moduleEntity);
        return new MessageResponseDto("Conta de serviço atualizada com sucesso");
    }

    public MessageResponseDto remove(UUID id) {
        ModuleEntity moduleEntity = findModuleOrThrow(id);
        moduleRepository.delete(moduleEntity);
        return new MessageResponseDto("Usuário removido com sucesso");
    }

    private boolean existsByUsername(String username) {
        return moduleRepository.findByUsername(username).isPresent();
    }

    private ModuleEntity findModuleOrThrow(UUID id) {
        return moduleRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Modulo não encontrado"
            ));
    }
}
 
