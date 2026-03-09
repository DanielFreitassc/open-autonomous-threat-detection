package com.danielfreitassc.backend.mappers.anomaly;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.danielfreitassc.backend.dtos.anomaly.AnomalyRequestDto;
import com.danielfreitassc.backend.dtos.anomaly.AnomalyResponseDto;
import com.danielfreitassc.backend.models.anomaly.AnomalyEntity;

@Mapper(componentModel = "spring")
public interface AnomalyMapper {
    AnomalyResponseDto entityToDto(AnomalyEntity anomalyEntity);

    AnomalyEntity dtoToEntity(AnomalyRequestDto anomalyRequestDto);

    void tuUpdate(AnomalyRequestDto anomalyRequestDto,@MappingTarget AnomalyEntity anomalyEntity);
}
