package com.danielfreitassc.backend.models.anomaly;

public enum Severity {

    LOW("Baixa"),
    MEDIUM("Média"),
    HIGH("Alta"),
    CRITICAL("Crítica");

    private final String label;

    Severity(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
