package com.danielfreitassc.backend.controllers.anomaly;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danielfreitassc.backend.dtos.anomaly.AnomalyRequestDto;
import com.danielfreitassc.backend.dtos.anomaly.AnomalyResponseDto;
import com.danielfreitassc.backend.dtos.common.MessageResponseDto;
import com.danielfreitassc.backend.services.anomaly.AnomalyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/anomalies")
public class AnomalyController {
    private final AnomalyService anomalyService;

    @PostMapping
    public AnomalyResponseDto create(@RequestBody @Valid AnomalyRequestDto anomalyRequestDto) {
        return anomalyService.create(anomalyRequestDto);
    }

    @GetMapping
    public Page<AnomalyResponseDto> getAll(Pageable pageable) {
        return anomalyService.getAll(pageable);
    }

    @GetMapping("/{id}")
    public AnomalyResponseDto getByid(@PathVariable UUID id) {
        return anomalyService.getByid(id);
    }

    @PutMapping("/{id}")
    public AnomalyResponseDto update(@PathVariable UUID id,@RequestBody @Valid AnomalyRequestDto anomalyRequestDto) {
        return anomalyService.update(id, anomalyRequestDto);
    }

    @DeleteMapping("/{id}")
    public MessageResponseDto delete(@PathVariable UUID id) {
        return anomalyService.delete(id);
    }
}
