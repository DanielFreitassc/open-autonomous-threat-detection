package com.danielfreitassc.backend.dtos.anomaly;

import java.util.List;

import com.danielfreitassc.backend.models.anomaly.AnomalyEntity;
import com.danielfreitassc.backend.models.anomaly.EventsEntity;
import com.danielfreitassc.backend.models.anomaly.FeaturesEntity;
import com.danielfreitassc.backend.models.anomaly.HttpRequestsEntity;
import com.danielfreitassc.backend.models.anomaly.RawLogsEntity;
import com.danielfreitassc.backend.models.anomaly.SourcersEntity;

public record EventFullEntities(
    EventsEntity eventsEntity,
    FeaturesEntity featuresEntity,
    List<HttpRequestsEntity> httpRequests,
    RawLogsEntity rawLogs,
    SourcersEntity sourcers,
    AnomalyEntity anomaly
) {}