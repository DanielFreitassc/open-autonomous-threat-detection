package com.danielfreitassc.backend.controllers.anomaly;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.danielfreitassc.backend.dtos.anomaly.EventFullRequestDto;
import com.danielfreitassc.backend.dtos.anomaly.EventFullResponseDto;
import com.danielfreitassc.backend.dtos.common.MessageResponseDto;
import com.danielfreitassc.backend.services.anomaly.EventFullService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/events") 
public class EventFullController {

    private final EventFullService eventFullService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EventFullResponseDto create(@RequestBody @Valid EventFullRequestDto requestDto) {
        return eventFullService.createFullEvent(requestDto);
    }

    @GetMapping
    public Page<EventFullResponseDto> getAll(Pageable pageable) {
        return eventFullService.getAll(pageable);
    }

    @GetMapping("/{id}")
    public EventFullResponseDto getById(@PathVariable UUID id) {
        return eventFullService.getById(id);
    }

    @PutMapping("/{id}")
    public EventFullResponseDto update(@PathVariable UUID id, @RequestBody @Valid EventFullRequestDto requestDto) {
        return eventFullService.update(id, requestDto);
    }

    @DeleteMapping("/{id}")
    public MessageResponseDto delete(@PathVariable UUID id) {
        return eventFullService.delete(id);
    }
}