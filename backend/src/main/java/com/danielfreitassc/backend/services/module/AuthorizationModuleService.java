package com.danielfreitassc.backend.services.module;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.danielfreitassc.backend.repositories.module.ModuleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthorizationModuleService implements UserDetailsService {
    private final ModuleRepository moduleRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return moduleRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado!"));
    }
    
}
