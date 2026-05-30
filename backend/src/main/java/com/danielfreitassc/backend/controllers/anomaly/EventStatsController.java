package com.danielfreitassc.backend.controllers.anomaly;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danielfreitassc.backend.dtos.anomaly.EventStatsCountResponseDto;
import com.danielfreitassc.backend.services.anomaly.EventStatsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventStatsController {

    private final EventStatsService eventStatsService;

    @GetMapping("/stats/last-24h")
    public ResponseEntity<List<EventStatsCountResponseDto>> getLast24HoursStats() {
        return ResponseEntity.ok(eventStatsService.getLast24HoursStats());
    }
}