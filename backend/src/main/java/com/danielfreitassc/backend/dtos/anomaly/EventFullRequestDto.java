package com.danielfreitassc.backend.dtos.anomaly;

import java.util.List;

import jakarta.validation.Valid;

public record EventFullRequestDto(
    @Valid EventsRequestDto events,
    @Valid List<HttpRequestsRequestDto> httpRequests,
    @Valid RawLogsRequestDto rawLogs,
    @Valid SourcersRequestDto sourcers,
    @Valid AnomalyRequestDto anomaly
) {}
