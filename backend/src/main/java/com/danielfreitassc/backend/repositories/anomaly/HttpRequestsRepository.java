package com.danielfreitassc.backend.repositories.anomaly;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danielfreitassc.backend.models.anomaly.HttpRequestsEntity;

public interface HttpRequestsRepository extends JpaRepository<HttpRequestsEntity, UUID> {
    List<HttpRequestsEntity> findByEventsEntityId(UUID eventId);
    void deleteByEventsEntityId(UUID eventId);
}
