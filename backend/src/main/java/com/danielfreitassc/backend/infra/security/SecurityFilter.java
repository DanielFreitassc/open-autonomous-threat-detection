package com.danielfreitassc.backend.infra.security;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.server.ResponseStatusException;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.danielfreitassc.backend.repositories.module.ModuleRepository;
import com.danielfreitassc.backend.repositories.user.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SecurityFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UserRepository userRepository;
    private final ModuleRepository moduleRepository;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String path = request.getServletPath();
        String method = request.getMethod();

        boolean isPublicEndpoint =
                (path.equals("/api/v1/users") && method.equals("POST")) ||
                (path.equals("/api/v1/auth/login") && method.equals("POST")) ||
                (path.equals("/api/v1/auth/login-modules") && method.equals("POST"));

        String token = recoverToken(request);

        try {

            if (token == null) {
                if (!isPublicEndpoint) {
                    customAuthenticationEntryPoint.commence(
                            request,
                            response,
                            new AuthenticationException("Token ausente") {});
                    return;
                }
            } else {

                String subject = tokenService.validateToken(token);
                UUID id = UUID.fromString(subject);

                Optional<UserDetails> userOpt =
                        userRepository.findById(id).map(u -> (UserDetails) u);

                Optional<UserDetails> moduleOpt =
                        moduleRepository.findById(id).map(m -> (UserDetails) m);

                UserDetails principal = userOpt.orElseGet(() ->
                        moduleOpt.orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Usuário ou módulo não encontrado")));

                var authentication = new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        principal.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        } catch (JWTVerificationException ex) {

            customAuthenticationEntryPoint.commence(
                    request,
                    response,
                    new AuthenticationException("Token inválido ou expirado") {});
            return;

        } catch (IllegalArgumentException ex) {

            customAuthenticationEntryPoint.commence(
                    request,
                    response,
                    new AuthenticationException("Formato do token inválido") {});
            return;

        }

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.replace("Bearer ", "");
        }

        if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {
                if ("token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }
}