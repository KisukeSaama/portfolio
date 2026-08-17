package com.jonathan.portfolio.auth;

import com.jonathan.portfolio.audit.*;
import com.jonathan.portfolio.auth.dto.*;
import com.jonathan.portfolio.security.CurrentAdmin;
import jakarta.servlet.http.*;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.*;
import org.springframework.security.core.context.*;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager; private final SecurityContextRepository contexts; private final LoginAttemptService attempts; private final AuditService audit; private final CurrentAdmin currentAdmin;
    public AuthController(AuthenticationManager authenticationManager,SecurityContextRepository contexts,LoginAttemptService attempts,AuditService audit,CurrentAdmin currentAdmin){this.authenticationManager=authenticationManager;this.contexts=contexts;this.attempts=attempts;this.audit=audit;this.currentAdmin=currentAdmin;}
    @GetMapping("/csrf") public Map<String,String> csrf(CsrfToken token){return Map.of("token",token.getToken(),"headerName",token.getHeaderName());}
    @PostMapping("/login") public ResponseEntity<?> login(@Valid @RequestBody LoginRequest body,HttpServletRequest request,HttpServletResponse response){
        var key=attempts.key(body.email(),clientIp(request)); if(attempts.blocked(key)){audit.record(AuditAction.LOGIN_FAILURE,null,null,"{\"reason\":\"rate_limited\"}",request);return genericFailure();}
        try{var auth=authenticationManager.authenticate(UsernamePasswordAuthenticationToken.unauthenticated(body.email().trim().toLowerCase(),body.password()));var context=SecurityContextHolder.createEmptyContext();context.setAuthentication(auth);contexts.saveContext(context,request,response);attempts.success(key);audit.record(AuditAction.LOGIN_SUCCESS,currentAdmin.id(auth),null,null,request);return ResponseEntity.ok(new SessionResponse(true,auth.getName(),"ADMIN"));}
        catch(AuthenticationException exception){attempts.failure(key);audit.record(AuditAction.LOGIN_FAILURE,null,null,"{\"reason\":\"invalid_credentials\"}",request);return genericFailure();}
    }
    @GetMapping("/session") public SessionResponse session(Authentication authentication){return authentication==null||!authentication.isAuthenticated()?SessionResponse.anonymous():new SessionResponse(true,authentication.getName(),"ADMIN");}
    @PostMapping("/logout") @ResponseStatus(HttpStatus.NO_CONTENT) public void logout(Authentication authentication,HttpServletRequest request,HttpServletResponse response){if(authentication!=null)audit.record(AuditAction.LOGOUT,currentAdmin.id(authentication),null,null,request);new SecurityContextLogoutHandler().logout(request,response,authentication);}
    private ResponseEntity<ApiMessage> genericFailure(){return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiMessage("Identifiants invalides ou connexion temporairement indisponible."));}
    private String clientIp(HttpServletRequest request){var forwarded=request.getHeader("X-Forwarded-For");return forwarded==null?request.getRemoteAddr():forwarded.split(",")[0].trim();}
    public record ApiMessage(String message){}
}
