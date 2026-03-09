package com.danielfreitassc.backend.controllers.module;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.danielfreitassc.backend.dtos.common.MessageResponseDto;
import com.danielfreitassc.backend.dtos.module.ModuleRequestDto;
import com.danielfreitassc.backend.dtos.module.ModuleResponseDto;
import com.danielfreitassc.backend.services.module.ModuleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/modules")
public class ModuleController {
    private final ModuleService moduleService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ModuleResponseDto create(@RequestBody @Valid ModuleRequestDto moduleRequestDto) {
        return moduleService.create(moduleRequestDto);
    }

    @GetMapping
    public Page<ModuleResponseDto> getAll(Pageable pageable) {
        return moduleService.getAll(pageable);
    }

    @GetMapping("/{id}")
    public ModuleResponseDto getModule(@PathVariable UUID id) {
        return moduleService.getModule(id);
    }

    @PatchMapping("/{id}")
    public MessageResponseDto update(@PathVariable UUID id,@RequestBody @Valid ModuleRequestDto moduleRequestDto) {
        return moduleService.update(id, moduleRequestDto);
    }

    @DeleteMapping("/{id}")
    public MessageResponseDto remove(@PathVariable UUID id) {
        return moduleService.remove(id);
    }
}
