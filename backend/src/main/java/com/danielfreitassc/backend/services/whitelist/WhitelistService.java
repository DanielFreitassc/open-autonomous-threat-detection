package com.danielfreitassc.backend.services.whitelist;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.danielfreitassc.backend.dtos.common.MessageResponseDto;
import com.danielfreitassc.backend.dtos.whitelist.WhitelistRequestDto;
import com.danielfreitassc.backend.dtos.whitelist.WhitelistResponseDto;
import com.danielfreitassc.backend.mappers.whitelist.WhitelistMapper;
import com.danielfreitassc.backend.models.whitelist.WhitelistEntity;
import com.danielfreitassc.backend.repositories.anomaly.EventsRepository;
import com.danielfreitassc.backend.repositories.whitelist.WhitelistRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WhitelistService {
    private final WhitelistMapper whitelistMapper;
    private final WhitelistRepository whitelistRepository;
    private final EventsRepository eventsRepository;

    @Transactional
    public MessageResponseDto create(WhitelistRequestDto whitelistRequestDto) {

        whitelistRepository.save(whitelistMapper.toEntity(whitelistRequestDto));
        
        eventsRepository.updateFalsePositiveStatusInBulk(
            whitelistRequestDto.endpoint(),
            whitelistRequestDto.statusCode(),
            whitelistRequestDto.bodySize(),
            true 
        );

        return new MessageResponseDto("Regra adicionada. Ocorrências históricas marcadas como falso positivo.");
    }

    public Page<WhitelistResponseDto> getWhitelist(Pageable pageable) {
        
        // Recria o Pageable forçando a ordenação pelo campo 'createdAt' (Ascendente)
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by("createdAt").ascending() 
        );

        // Usa o findAll() nativo do JpaRepository
        return whitelistRepository.findAll(sortedPageable).map(whitelistMapper::toDto);
    }

    @Transactional 
    public MessageResponseDto delete(UUID id) {
        WhitelistEntity whitelist = findWhitelistOrThrow(id);

        eventsRepository.updateFalsePositiveStatusInBulk(
            whitelist.getEndpoint(),
            whitelist.getStatusCode(),
            whitelist.getBodySize(),
            false 
        );
        
        whitelistRepository.delete(whitelist);

        return new MessageResponseDto("Exceção removida. Eventos restaurados para análise.");
    }

    private WhitelistEntity findWhitelistOrThrow(UUID id) {
        return whitelistRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Exceção não encontrada"));
    }
}