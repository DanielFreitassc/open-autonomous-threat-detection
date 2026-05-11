package com.danielfreitassc.backend.models.anomaly;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sources")
@Entity(name = "sourcers")
public class SourcersEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @OneToOne
    @JoinColumn(name = "event_id")
    private EventsEntity eventsEntity;
    
    private String service;
    private String engine;
    private String host;
    private String clientIp;
    
    @Column(columnDefinition = "TEXT")
    private String userAgent;
    
}