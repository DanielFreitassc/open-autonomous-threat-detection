package com.danielfreitassc.backend.models.anomaly;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "events")
@Entity(name = "events")
public class EventsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private LocalDateTime timestamp;
    private String category;
    private String type;
    private String outcome;

    @OneToOne(mappedBy = "eventsEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private AnomalyEntity anomaly;

    @OneToOne(mappedBy = "eventsEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private FeaturesEntity features;

    @OneToOne(mappedBy = "eventsEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private RawLogsEntity rawLogs;

    @OneToOne(mappedBy = "eventsEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private SourcersEntity sourcers;

    @OneToMany(mappedBy = "eventsEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HttpRequestsEntity> httpRequests;
}
