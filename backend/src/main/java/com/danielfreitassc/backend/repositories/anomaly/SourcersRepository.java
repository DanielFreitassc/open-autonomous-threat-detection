package com.danielfreitassc.backend.repositories.anomaly;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danielfreitassc.backend.models.anomaly.SourcersEntity;

public interface SourcersRepository extends JpaRepository<SourcersEntity, UUID> {
    Optional<SourcersEntity> findByEventsEntityId(UUID eventId);
    void deleteByEventsEntityId(UUID eventId);
}
