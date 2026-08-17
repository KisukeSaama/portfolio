package com.jonathan.portfolio.config;

import tools.jackson.databind.ObjectMapper;
import com.jonathan.portfolio.common.api.ApiError;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.*;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.session.Session;
import org.springframework.session.security.SpringSessionBackedSessionRegistry;

@Configuration @EnableMethodSecurity
public class SecurityConfig {
    /** Mirrors {@code springdoc.api-docs.enabled}: when the docs are off, their URLs are not public either. */
    private final boolean apiDocsEnabled;

    public SecurityConfig(@Value("${springdoc.api-docs.enabled:true}") boolean apiDocsEnabled) {
        this.apiDocsEnabled = apiDocsEnabled;
    }

    @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder(12);}
    @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration configuration)throws Exception{return configuration.getAuthenticationManager();}
    @Bean SecurityContextRepository securityContextRepository(){return new HttpSessionSecurityContextRepository();}

    /**
     * Sessions live in PostgreSQL, so the default in-memory registry never sees them and the
     * concurrency limit below would silently do nothing. This backs it with the same store.
     */
    @Bean <S extends Session> SessionRegistry sessionRegistry(FindByIndexNameSessionRepository<S> sessions){
        return new SpringSessionBackedSessionRegistry<>(sessions);
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http,ObjectMapper mapper,SessionRegistry sessionRegistry)throws Exception{
        var csrf=CookieCsrfTokenRepository.withHttpOnlyFalse();csrf.setCookieName("XSRF-TOKEN");csrf.setHeaderName("X-XSRF-TOKEN");csrf.setCookiePath("/");
        var requestHandler=new CsrfTokenRequestAttributeHandler();requestHandler.setCsrfRequestAttributeName("_csrf");
        http
            .csrf(config->config.csrfTokenRepository(csrf).csrfTokenRequestHandler(requestHandler))
            .authorizeHttpRequests(auth->{
                // `/auth/session` is anonymous on purpose: it answers "are you signed in?" and the
                // administration UI asks before it has a session. Guarding it made that question
                // itself a 401, so the sign-in page could never be reached.
                auth.requestMatchers("/api/v1/public/**","/api/v1/auth/csrf","/api/v1/auth/login","/api/v1/auth/session","/actuator/health/**").permitAll();
                // The OpenAPI document maps the whole administration surface. It is a development
                // aid, so it is only reachable where springdoc itself is switched on.
                if(apiDocsEnabled)auth.requestMatchers("/api/openapi/**","/api/docs/**","/api/docs").permitAll();
                auth.requestMatchers("/api/v1/admin/**").hasRole("ADMIN").anyRequest().authenticated();
            })
            .sessionManagement(session->session.sessionFixation(fix->fix.migrateSession()).maximumSessions(1).sessionRegistry(sessionRegistry))
            .exceptionHandling(errors->errors
                .authenticationEntryPoint((request,response,exception)->writeError(response,mapper,401,"unauthorized","Authentication required.",request.getAttribute("correlationId")))
                .accessDeniedHandler((request,response,exception)->writeError(response,mapper,403,"forbidden","This action is not allowed.",request.getAttribute("correlationId"))))
            .headers(headers->headers.contentSecurityPolicy(csp->csp.policyDirectives("default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'")).frameOptions(frame->frame.deny()).referrerPolicy(ref->ref.policy(org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER)))
            .requestCache(cache->cache.disable());
        return http.build();
    }
    private static void writeError(HttpServletResponse response,ObjectMapper mapper,int status,String code,String message,Object correlation)throws java.io.IOException{response.setStatus(status);response.setContentType(MediaType.APPLICATION_JSON_VALUE);mapper.writeValue(response.getOutputStream(),ApiError.of(code,message,correlation==null?"unknown":correlation.toString()));}
}
