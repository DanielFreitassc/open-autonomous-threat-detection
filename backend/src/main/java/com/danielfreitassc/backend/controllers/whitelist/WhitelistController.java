package com.danielfreitassc.backend.controllers.whitelist;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.danielfreitassc.backend.dtos.common.MessageResponseDto;
import com.danielfreitassc.backend.dtos.whitelist.WhitelistRequestDto;
import com.danielfreitassc.backend.dtos.whitelist.WhitelistResponseDto;
import com.danielfreitassc.backend.services.whitelist.WhitelistService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/whitelist")
public class WhitelistController {
    private final WhitelistService whitelistService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MessageResponseDto create(@RequestBody @Valid WhitelistRequestDto whitelistRequestDto) {
        return whitelistService.create(whitelistRequestDto);
    }

    @GetMapping
    public Page<WhitelistResponseDto> getWhitelist(Pageable pageable) {
        return whitelistService.getWhitelist(pageable);
    }

    @DeleteMapping("/{id}")
    public MessageResponseDto delete(@PathVariable UUID id) {
        return whitelistService.delete(id);
    }
}
