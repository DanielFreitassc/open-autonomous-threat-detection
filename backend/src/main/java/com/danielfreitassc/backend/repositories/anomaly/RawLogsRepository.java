package com.danielfreitassc.backend.repositories.anomaly;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danielfreitassc.backend.models.anomaly.RawLogsEntity;

public interface RawLogsRepository extends JpaRepository<RawLogsEntity, UUID> {
    Optional<RawLogsEntity> findByEventsEntityId(UUID eventId);
    void deleteByEventsEntityId(UUID eventId);
}
