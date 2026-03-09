package com.danielfreitassc.backend.services.anomaly;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.danielfreitassc.backend.dtos.anomaly.AnomalyRequestDto;
import com.danielfreitassc.backend.dtos.anomaly.AnomalyResponseDto;
import com.danielfreitassc.backend.dtos.common.MessageResponseDto;
import com.danielfreitassc.backend.mappers.anomaly.AnomalyMapper;
import com.danielfreitassc.backend.models.anomaly.AnomalyEntity;
import com.danielfreitassc.backend.repositories.anomaly.AnomalyRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnomalyService {
    private final AnomalyRepository anomalyRepository;
    private final AnomalyMapper anomalyMapper;

    public AnomalyResponseDto create(AnomalyRequestDto anomalyRequestDto) {
        AnomalyEntity anomalyEntity = anomalyMapper.dtoToEntity(anomalyRequestDto);

        anomalyRepository.save(anomalyEntity);
        return anomalyMapper.entityToDto(anomalyEntity);
    }

    public Page<AnomalyResponseDto> getAll(Pageable pageable) {
        return anomalyRepository.findAll(pageable).map(anomalyMapper::entityToDto);
    }

    public AnomalyResponseDto getByid(UUID id) {
        return anomalyMapper.entityToDto(findAnomalyOrThrow(id));
    }

    @Transactional
    public AnomalyResponseDto update(UUID id, AnomalyRequestDto anomalyRequestDto) {
        AnomalyEntity anomalyEntity = findAnomalyOrThrow(id);

        anomalyMapper.tuUpdate(anomalyRequestDto, anomalyEntity);
        return anomalyMapper.entityToDto(anomalyEntity);
    }   

    public MessageResponseDto delete(UUID id) {
        anomalyRepository.delete(findAnomalyOrThrow(id));
        return new MessageResponseDto("Anomalia removida com sucesso");
    }

    private AnomalyEntity findAnomalyOrThrow(UUID id) {
        return anomalyRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Nenhuma anomalia encontrada com este ID"));
    }
}
