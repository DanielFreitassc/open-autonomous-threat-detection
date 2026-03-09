package com.danielfreitassc.backend.infra.security;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.danielfreitassc.backend.models.module.ModuleEntity;

@Service
public class TokenModuleService {
    @Value("${api.security.token.secret}")
    private String secret;
    
    public String generateToken(ModuleEntity moduleEntity) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);

            String token = JWT.create()
                    .withIssuer("auth-api")
                    .withSubject(moduleEntity.getId().toString())
                    .withClaim("name", moduleEntity.getName())
                    .withClaim("username", moduleEntity.getUsername())
                    .withClaim("role", moduleEntity.getRole().toString())
                    .withExpiresAt(generateExpirationDate())
                    .sign(algorithm);
            return token;
        } catch (JWTCreationException exception) {
           throw new RuntimeException("Erro ao gerar token", exception);
        }
    }

    public String validateToken(String token) {
        try {
                Algorithm algorithm = Algorithm.HMAC256(secret);
                return JWT.require(algorithm)
                    .withIssuer("auth-api")
                    .build()
                    .verify(token)
                    .getSubject();
            } catch (TokenExpiredException exception) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token expirado");
            } catch (JWTVerificationException exception) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Token inválido");
            }
        }

    private Instant generateExpirationDate() {
        return LocalDateTime.now().plusHours(10).toInstant(ZoneOffset.of("-03:00"));
    }
}
