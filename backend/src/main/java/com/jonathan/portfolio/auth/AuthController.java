package com.jonathan.portfolio.auth;

import com.jonathan.portfolio.audit.*;
import com.jonathan.portfolio.auth.dto.*;
import com.jonathan.portfolio.security.ClientIpResolver;
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
    private final AuthenticationManager authenticationManager; private final SecurityContextRepository contexts; private final LoginAttemptService attempts; private final AuditService audit; private final CurrentAdmin currentAdmin; private final ClientIpResolver clientIps;
    public AuthController(AuthenticationManager authenticationManager,SecurityContextRepository contexts,LoginAttemptService attempts,AuditService audit,CurrentAdmin currentAdmin,ClientIpResolver clientIps){this.authenticationManager=authenticationManager;this.contexts=contexts;this.attempts=attempts;this.audit=audit;this.currentAdmin=currentAdmin;this.clientIps=clientIps;}
    @GetMapping("/csrf") public Map<String,String> csrf(CsrfToken token){return Map.of("token",token.getToken(),"headerName",token.getHeaderName());}
    @PostMapping("/login") public ResponseEntity<?> login(@Valid @RequestBody LoginRequest body,HttpServletRequest request,HttpServletResponse response){
        var key=attempts.key(body.email(),clientIps.resolve(request)); if(attempts.blocked(key)){audit.record(AuditAction.LOGIN_FAILURE,null,null,"{\"reason\":\"rate_limited\"}",request);return genericFailure();}
        try{var auth=authenticationManager.authenticate(UsernamePasswordAuthenticationToken.unauthenticated(body.email().trim().toLowerCase(),body.password()));var context=SecurityContextHolder.createEmptyContext();context.setAuthentication(auth);contexts.saveContext(context,request,response);attempts.success(key);audit.record(AuditAction.LOGIN_SUCCESS,currentAdmin.id(auth),null,null,request);return ResponseEntity.ok(new SessionResponse(true,auth.getName(),"ADMIN"));}
        catch(AuthenticationException exception){attempts.failure(key);audit.record(AuditAction.LOGIN_FAILURE,null,null,"{\"reason\":\"invalid_credentials\"}",request);return genericFailure();}
    }
    @GetMapping("/session") public SessionResponse session(Authentication authentication){return authentication==null||!authentication.isAuthenticated()?SessionResponse.anonymous():new SessionResponse(true,authentication.getName(),"ADMIN");}
    @PostMapping("/logout") @ResponseStatus(HttpStatus.NO_CONTENT) public void logout(Authentication authentication,HttpServletRequest request,HttpServletResponse response){if(authentication!=null)audit.record(AuditAction.LOGOUT,currentAdmin.id(authentication),null,null,request);new SecurityContextLogoutHandler().logout(request,response,authentication);}
    // Deliberately the same answer for a bad password, an unknown account, a disabled account and a
    // rate-limited caller: anything more precise tells an attacker which emails are worth trying.
    private ResponseEntity<ApiMessage> genericFailure(){return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiMessage("Invalid credentials, or sign-in is temporarily unavailable."));}
    public record ApiMessage(String message){}
}
