package com.danielfreitassc.backend.mappers.anomaly;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.danielfreitassc.backend.dtos.anomaly.*;
import com.danielfreitassc.backend.models.anomaly.*;

@Mapper(componentModel = "spring")
public interface EventFullMapper {

    default EventFullEntities dtoToEntities(EventFullRequestDto dto) {
        if (dto == null) return null;

        EventsEntity event = new EventsEntity();
        event.setTimestamp(dto.events().timestamp());
        event.setCategory(dto.events().category());
        event.setType(dto.events().type());
        event.setOutcome(dto.events().outcome());

        List<HttpRequestsEntity> httpRequests = dto.httpRequests() != null 
            ? dto.httpRequests().stream()
                .map(h -> toHttpRequestsEntity(h, event))
                .collect(Collectors.toList())
            : null;

        RawLogsEntity rawLogs = toRawLogsEntity(dto.rawLogs(), event);
        SourcersEntity sourcers = toSourcersEntity(dto.sourcers(), event);
        AnomalyEntity anomaly = toAnomalyEntity(dto.anomaly(), event);

        // Retorna o record wrapper sem o Features
        return new EventFullEntities(event, httpRequests, rawLogs, sourcers, anomaly);
    }

    @Mapping(target = "events", source = "event")
    @Mapping(target = "httpRequests", source = "http")
    @Mapping(target = "rawLogs", source = "raw")
    @Mapping(target = "sourcers", source = "source")
    @Mapping(target = "anomaly", source = "anomalyEntity")
    EventFullResponseDto entitiesToResponseDto(
        EventsEntity event, 
        List<HttpRequestsEntity> http, 
        RawLogsEntity raw, 
        SourcersEntity source, 
        AnomalyEntity anomalyEntity 
    );

    EventsResponseDto toEventsResponseDto(EventsEntity entity);

    AnomalyResponseDto toAnomalyResponseDto(AnomalyEntity entity);

    default HttpRequestsEntity toHttpRequestsEntity(HttpRequestsRequestDto dto, EventsEntity event) {
        if (dto == null) return null;
        HttpRequestsEntity entity = new HttpRequestsEntity();
        entity.setMethod(dto.method());
        entity.setEndpoint(dto.endpoint());
        entity.setStatusCode(dto.statusCode());
        entity.setProtocol(dto.protocol());
        entity.setEventsEntity(event);
        return entity;
    }

    default RawLogsEntity toRawLogsEntity(RawLogsRequestDto dto, EventsEntity event) {
        if (dto == null) return null;
        RawLogsEntity entity = new RawLogsEntity();
        entity.setRaw(dto.raw());
        entity.setEventsEntity(event);
        return entity;
    }

    default SourcersEntity toSourcersEntity(SourcersRequestDto dto, EventsEntity event) {
        if (dto == null) return null;
        SourcersEntity entity = new SourcersEntity();
        entity.setService(dto.service());
        entity.setEngine(dto.engine());
        entity.setHost(dto.host());
        entity.setClientIp(dto.clientIp());
        entity.setUserAgent(dto.userAgent());
        entity.setEventsEntity(event);
        return entity;
    }

    default AnomalyEntity toAnomalyEntity(AnomalyRequestDto dto, EventsEntity event) {
        if (dto == null) return null;
        AnomalyEntity entity = new AnomalyEntity();
        entity.setRule(dto.rule());
        entity.setSeverity(dto.severity());
        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setFullLog(dto.fullLog());
        entity.setTimestamp(dto.timestamp());
        entity.setEventsEntity(event); 
        
        return entity;
    }
}