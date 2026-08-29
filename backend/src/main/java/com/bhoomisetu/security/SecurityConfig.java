package com.bhoomisetu.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public Endpoints & Read APIs
                        .requestMatchers("/", "/api", "/api/health", "/api/auth/**", "/api/ai/**", "/api/public/**", "/error", "/favicon.ico", "/api/agency/**", "/api/tehsildar/**", "/api/executive/**", "/api/officer/**", "/api/revenue-officer/**", "/api/revenue/**", "/api/district/**", "/api/state/**", "/api/central/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/projects/**", "/api/lands/**", "/api/khasras/**", "/api/citizen/**", "/api/citizens/**", "/api/notifications/**", "/api/documents/**", "/api/objections/**", "/api/rr/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/rr/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // User Preferences & Profiles
                        .requestMatchers("/api/users/**").authenticated()

                        // Role-Based Authorization
                        .requestMatchers("/api/citizen/**").hasRole("CITIZEN")
                        .requestMatchers("/api/revenue-officer/**", "/api/revenue/**").hasAnyRole("REVENUE_OFFICER", "GOVERNMENT_OFFICER", "ADMIN")
                        .requestMatchers("/api/officer/**").hasAnyRole("GOVERNMENT_OFFICER", "REVENUE_OFFICER", "TEHSILDAR")
                        .requestMatchers("/api/agency/**", "/api/executive/**").hasAnyRole("PROJECT_AGENCY", "EXECUTIVE_OFFICER")
                        .requestMatchers("/api/district/**").hasAnyRole("DISTRICT_AUTHORITY", "DISTRICT_MAGISTRATE", "DISTRICT_OFFICER", "ADMIN")
                        .requestMatchers("/api/state/**").hasAnyRole("STATE_GOVERNMENT", "ADMIN")
                        .requestMatchers("/api/central/**").hasAnyRole("CENTRAL_MINISTRY", "ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Authenticated Fallback
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:[*]",
                "http://127.0.0.1:[*]"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
