package com.danielfreitassc.backend.services.anomaly;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.danielfreitassc.backend.dtos.anomaly.EventStatsCountResponseDto;
import com.danielfreitassc.backend.models.anomaly.EventsEntity;
import com.danielfreitassc.backend.models.anomaly.Severity;
import com.danielfreitassc.backend.repositories.anomaly.EventsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventStatsService {

    private final EventsRepository eventsRepository;

    public List<EventStatsCountResponseDto> getLast24HoursStats() {
        LocalDateTime now = LocalDateTime.now();
        // Recua 23 horas e zera os minutos e segundos para alinhar os blocos
        LocalDateTime startTime = now.minusHours(23).truncatedTo(ChronoUnit.HOURS);

        // 1. Busca os eventos verdadeiros das últimas 24h
        List<EventsEntity> recentEvents = eventsRepository
                .findByTimestampAfterAndFalsePositiveFalseOrderByTimestampAsc(startTime);

        // 2. Pré-popula o mapa com as 24 horas zeradas
        Map<LocalDateTime, EventStatsCounter> buckets = new LinkedHashMap<>();
        for (int i = 0; i < 24; i++) {
            buckets.put(startTime.plusHours(i), new EventStatsCounter());
        }

        // 3. Agrupa os eventos nos blocos
        for (EventsEntity event : recentEvents) {
            if (event.getTimestamp() == null || event.getAnomaly() == null) continue;
            
            LocalDateTime eventHour = event.getTimestamp().truncatedTo(ChronoUnit.HOURS);
            
            if (buckets.containsKey(eventHour)) {
                Severity severity = event.getAnomaly().getSeverity();
                buckets.get(eventHour).increment(severity);
            }
        }

        // 4. Converte para a lista do seu DTO
        List<EventStatsCountResponseDto> responseList = new ArrayList<>();
        buckets.forEach((time, counter) -> {
            responseList.add(new EventStatsCountResponseDto(
                    Timestamp.valueOf(time),
                    counter.critical,
                    counter.high,
                    counter.medium,
                    counter.low
            ));
        });

        return responseList;
    }

    // Classe auxiliar interna para facilitar a contagem
    private static class EventStatsCounter {
        int critical = 0;
        int high = 0;
        int medium = 0;
        int low = 0;

        void increment(Severity severity) {
            if (severity == null) return;
            // Utilizando o Enum Severity definido no seu model
            switch (severity) {
                case CRITICAL -> critical++;
                case HIGH -> high++;
                case MEDIUM -> medium++;
                case LOW -> low++;
            }
        }
    }
}