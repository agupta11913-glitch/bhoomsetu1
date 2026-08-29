package com.bhoomisetu.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
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
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 1. CORS Preflight OPTIONS requests must be completely open
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 2. Public Authentication, Health, AI Assistant, and Base Endpoints
                        .requestMatchers("/", "/api", "/api/health", "/api/auth/**", "/api/ai/**", "/api/public/**", "/error", "/favicon.ico").permitAll()

                        // 3. Public Read APIs (Lands, Projects, Khasras, GIS, Objections, Documents, Notifications)
                        .requestMatchers(HttpMethod.GET, 
                                "/api/projects", "/api/projects/**",
                                "/api/lands", "/api/lands/**",
                                "/api/khasras", "/api/khasras/**",
                                "/api/gis/**",
                                "/api/citizen/**", "/api/citizens/**",
                                "/api/notifications", "/api/notifications/**",
                                "/api/documents", "/api/documents/**",
                                "/api/objections", "/api/objections/**",
                                "/api/rr/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/rr/**", "/api/objections").permitAll()

                        // 4. Portal Views & Demo Endpoints
                        .requestMatchers("/api/agency/**", "/api/tehsildar/**", "/api/executive/**", "/api/officer/**", "/api/revenue-officer/**", "/api/revenue/**", "/api/district/**", "/api/state/**", "/api/central/**").permitAll()

                        // 5. User Preferences & Profiles (Authenticated)
                        .requestMatchers("/api/users/**").authenticated()

                        // 6. Role-Based Protected Endpoints
                        .requestMatchers("/api/citizen/**").hasRole("CITIZEN")
                        .requestMatchers("/api/revenue-officer/**", "/api/revenue/**").hasAnyRole("REVENUE_OFFICER", "GOVERNMENT_OFFICER", "ADMIN")
                        .requestMatchers("/api/officer/**").hasAnyRole("GOVERNMENT_OFFICER", "REVENUE_OFFICER", "TEHSILDAR")
                        .requestMatchers("/api/agency/**", "/api/executive/**").hasAnyRole("PROJECT_AGENCY", "EXECUTIVE_OFFICER")
                        .requestMatchers("/api/district/**").hasAnyRole("DISTRICT_AUTHORITY", "DISTRICT_MAGISTRATE", "DISTRICT_OFFICER", "ADMIN")
                        .requestMatchers("/api/state/**").hasAnyRole("STATE_GOVERNMENT", "ADMIN")
                        .requestMatchers("/api/central/**").hasAnyRole("CENTRAL_MINISTRY", "ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // 7. Authenticated Fallback
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Exact Netlify production origin, Netlify subdomains, Render origin, Vercel, and local development
        configuration.setAllowedOriginPatterns(List.of(
                "https://bhoomsetu.netlify.app",
                "https://*.netlify.app",
                "https://netlify.app",
                "https://bhoomsetu1.onrender.com",
                "https://*.onrender.com",
                "https://*.vercel.app",
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:8080",
                "http://localhost:[*]",
                "http://127.0.0.1:[*]"
        ));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Accept",
                "X-Requested-With",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));
        configuration.setExposedHeaders(List.of("Authorization", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
