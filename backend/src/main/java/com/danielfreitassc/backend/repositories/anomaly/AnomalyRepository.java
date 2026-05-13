package com.danielfreitassc.backend.repositories.anomaly;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danielfreitassc.backend.models.anomaly.AnomalyEntity;

public interface AnomalyRepository extends JpaRepository<AnomalyEntity, UUID> {
    Optional<AnomalyEntity> findByEventsEntityIdOrderByTimestampDesc(UUID eventId);
    void deleteByEventsEntityId(UUID eventId);
}
