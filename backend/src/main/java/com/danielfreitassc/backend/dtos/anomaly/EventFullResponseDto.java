package com.danielfreitassc.backend.dtos.anomaly;

import java.util.List;

public record EventFullResponseDto(
    EventsResponseDto events,
    List<HttpRequestsResponseDto> httpRequests,
    RawLogsResponseDto rawLogs,
    SourcersResponseDto sourcers,
    AnomalyResponseDto anomaly
) {}
