package com.danielfreitassc.backend.repositories.whitelist;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danielfreitassc.backend.models.whitelist.WhitelistEntity;

public interface WhitelistRepository extends JpaRepository<WhitelistEntity, UUID>{
    
}
