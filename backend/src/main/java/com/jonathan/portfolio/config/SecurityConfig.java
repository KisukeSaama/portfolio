package com.jonathan.portfolio.config;

import tools.jackson.databind.ObjectMapper;
import com.jonathan.portfolio.common.api.ApiError;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import org.springframework.context.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.*;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

@Configuration @EnableMethodSecurity
public class SecurityConfig {
    @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder(12);}
    @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration configuration)throws Exception{return configuration.getAuthenticationManager();}
    @Bean SecurityContextRepository securityContextRepository(){return new HttpSessionSecurityContextRepository();}
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http,ObjectMapper mapper)throws Exception{
        var csrf=CookieCsrfTokenRepository.withHttpOnlyFalse();csrf.setCookieName("XSRF-TOKEN");csrf.setHeaderName("X-XSRF-TOKEN");csrf.setCookiePath("/");
        var requestHandler=new CsrfTokenRequestAttributeHandler();requestHandler.setCsrfRequestAttributeName("_csrf");
        http
            .csrf(config->config.csrfTokenRepository(csrf).csrfTokenRequestHandler(requestHandler))
            .authorizeHttpRequests(auth->auth.requestMatchers("/api/v1/public/**","/api/v1/auth/csrf","/api/v1/auth/login","/actuator/health/**","/api/openapi/**","/api/docs/**","/api/docs").permitAll().requestMatchers("/api/v1/admin/**").hasRole("ADMIN").anyRequest().authenticated())
            .sessionManagement(session->session.sessionFixation(fix->fix.migrateSession()).maximumSessions(1))
            .exceptionHandling(errors->errors
                .authenticationEntryPoint((request,response,exception)->writeError(response,mapper,401,"unauthorized","Authentification requise.",request.getAttribute("correlationId")))
                .accessDeniedHandler((request,response,exception)->writeError(response,mapper,403,"forbidden","Cette action n’est pas autorisée.",request.getAttribute("correlationId"))))
            .headers(headers->headers.contentSecurityPolicy(csp->csp.policyDirectives("default-src 'none'; frame-ancestors 'none'; base-uri 'none'")).frameOptions(frame->frame.deny()).referrerPolicy(ref->ref.policy(org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER)))
            .requestCache(cache->cache.disable());
        return http.build();
    }
    private static void writeError(HttpServletResponse response,ObjectMapper mapper,int status,String code,String message,Object correlation)throws java.io.IOException{response.setStatus(status);response.setContentType(MediaType.APPLICATION_JSON_VALUE);mapper.writeValue(response.getOutputStream(),ApiError.of(code,message,correlation==null?"unknown":correlation.toString()));}
}
