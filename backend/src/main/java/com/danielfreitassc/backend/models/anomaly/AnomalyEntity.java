package com.danielfreitassc.backend.models.anomaly;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "anomalies")
@Entity(name = "anomalies")
public class AnomalyEntity {
    
    @Id
    @GeneratedValue
    private UUID id;
    private String sourceType; 
    private String host;
    private String rule;
    private Severity severity;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(columnDefinition = "TEXT")
    private String fullLog;
    private Instant createdAt;
}
