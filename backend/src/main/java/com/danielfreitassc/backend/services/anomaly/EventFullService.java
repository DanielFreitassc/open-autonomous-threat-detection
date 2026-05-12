package com.danielfreitassc.backend.services.anomaly;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.danielfreitassc.backend.dtos.anomaly.*;
import com.danielfreitassc.backend.dtos.common.MessageResponseDto;
import com.danielfreitassc.backend.mappers.anomaly.EventFullMapper;
import com.danielfreitassc.backend.models.anomaly.*;
import com.danielfreitassc.backend.repositories.anomaly.*;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventFullService {

    private final EventsRepository eventsRepository;
    private final EventFullMapper eventFullMapper;

    @Transactional
    public EventFullResponseDto createFullEvent(EventFullRequestDto requestDto) {
        EventFullEntities entities = eventFullMapper.dtoToEntities(requestDto);
        EventsEntity event = entities.eventsEntity();

        event.setAnomaly(entities.anomaly());
        event.setRawLogs(entities.rawLogs());
        event.setSourcers(entities.sourcers());
        event.setHttpRequests(entities.httpRequests());

        eventsRepository.save(event);

        return mapToResponseDto(event);
    }

    public Page<EventFullResponseDto> getAll(Pageable pageable) {
        return eventsRepository.findByFalsePositiveFalse(pageable).map(this::mapToResponseDto);
    }

    public EventFullResponseDto getById(UUID id) {
        return mapToResponseDto(findEventOrThrow(id));
    }

    @Transactional
    public EventFullResponseDto update(UUID id, EventFullRequestDto requestDto) {
        
        EventFullEntities newEntities = eventFullMapper.dtoToEntities(requestDto);
        EventsEntity updatedEvent = newEntities.eventsEntity();
        
        updatedEvent.setId(id);
        
        updatedEvent.setAnomaly(newEntities.anomaly());
        updatedEvent.setRawLogs(newEntities.rawLogs());
        updatedEvent.setSourcers(newEntities.sourcers());
        updatedEvent.setHttpRequests(newEntities.httpRequests());

        eventsRepository.save(updatedEvent);

        return mapToResponseDto(updatedEvent);
    }

    @Transactional
    public MessageResponseDto delete(UUID id) {
        EventsEntity event = findEventOrThrow(id);
        eventsRepository.delete(event);
        return new MessageResponseDto("Evento e dados relacionados removidos com sucesso");
    }


    private EventsEntity findEventOrThrow(UUID id) {
        return eventsRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento não encontrado"));
    }

    private EventFullResponseDto mapToResponseDto(EventsEntity event) {
        return eventFullMapper.entitiesToResponseDto(
            event, 
            event.getHttpRequests(), 
            event.getRawLogs(), 
            event.getSourcers(), 
            event.getAnomaly()
        );
    }
}