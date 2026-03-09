package com.danielfreitassc.backend.infra.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfigurations {
    private final SecurityFilter securityFilter;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception{
        return httpSecurity
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                    .authenticationEntryPoint(customAuthenticationEntryPoint)
                    .accessDeniedHandler(customAccessDeniedHandler)
                )
                .authorizeHttpRequests(authorize -> authorize

                .requestMatchers(HttpMethod.POST,"/api/v1/users").permitAll()
                .requestMatchers(HttpMethod.POST,"/api/v1/users/{id}/activate").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET,"/api/v1/users").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET,"/api/v1/users/{id}").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH,"/api/v1/users/{id}").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE,"/api/v1/users/{id}").hasRole("ADMIN")
                
                .requestMatchers(HttpMethod.POST,"/api/v1/modules").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET,"/api/v1/modules").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH,"/api/v1/modules/{id}").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE,"/api/v1/modules/{id}").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET,"/api/v1/modules/{id}").hasRole("ADMIN")

                .requestMatchers(HttpMethod.GET,"/api/v1/auth/me").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/auth/login-modules").permitAll()
                
                .requestMatchers(HttpMethod.POST,"/api/v1/anomalies").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET,"/api/v1/anomalies").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET,"/api/v1/anomalies/{id}").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,"/api/v1/anomalies/{id}").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE,"/api/v1/anomalies/{id}").hasRole("ADMIN")

                .requestMatchers("/error").anonymous()
                .anyRequest().denyAll()

                ).addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class).build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.addAllowedOrigin("http://localhost:3000");
        configuration.addAllowedOrigin("https://localhost");
        configuration.addAllowedMethod(HttpMethod.POST);
        configuration.addAllowedMethod(HttpMethod.GET);
        configuration.addAllowedMethod(HttpMethod.PUT);
        configuration.addAllowedMethod(HttpMethod.PATCH);
        configuration.addAllowedMethod(HttpMethod.DELETE);
        configuration.addAllowedHeader("*"); 

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
