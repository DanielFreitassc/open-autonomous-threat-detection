package com.danielfreitassc.backend.repositories.anomaly;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.danielfreitassc.backend.models.anomaly.EventsEntity;

public interface EventsRepository extends JpaRepository<EventsEntity, UUID> {

    Page<EventsEntity> findByFalsePositiveFalse(Pageable pageable);

    @Modifying
    @Query("UPDATE events e SET e.falsePositive = :status WHERE e.id IN " +
           "(SELECT h.eventsEntity.id FROM http_requests h " + 
           "WHERE h.endpoint = :endpoint AND h.statusCode = :statusCode AND h.bodySize = :bodySize)")
    void updateFalsePositiveStatusInBulk(
        @Param("endpoint") String endpoint, 
        @Param("statusCode") String statusCode, 
        @Param("bodySize") String bodySize,
        @Param("status") boolean status
    );
}