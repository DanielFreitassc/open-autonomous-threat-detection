package com.danielfreitassc.backend.repositories.anomaly;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danielfreitassc.backend.models.anomaly.FeaturesEntity;

public interface FeaturesRepository extends JpaRepository<FeaturesEntity, UUID> {
    Optional<FeaturesEntity> findByEventsEntityId(UUID eventId);
    void deleteByEventsEntityId(UUID eventId);
}
