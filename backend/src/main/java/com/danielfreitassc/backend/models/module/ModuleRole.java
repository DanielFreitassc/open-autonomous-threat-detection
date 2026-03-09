package com.danielfreitassc.backend.models.module;

public enum ModuleRole {
    MODULE("Module");

    private String role;

    ModuleRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}
