package com.jonathan.portfolio.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.HexFormat;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoginAttemptService {
    private static final int MAX_FAILURES=5; private static final Duration BLOCK_DURATION=Duration.ofMinutes(15);
    private final LoginAttemptRepository attempts; public LoginAttemptService(LoginAttemptRepository attempts){this.attempts=attempts;}
    public String key(String email,String ip){try{var digest=MessageDigest.getInstance("SHA-256");return HexFormat.of().formatHex(digest.digest((ip+":"+email.toLowerCase()).getBytes(StandardCharsets.UTF_8)));}catch(Exception ex){throw new IllegalStateException("Hash algorithm unavailable",ex);}}
    @Transactional(readOnly=true) public boolean blocked(String key){return attempts.findById(key).map(LoginAttempt::blocked).orElse(false);}
    @Transactional public void failure(String key){var attempt=attempts.findById(key).orElseGet(()->new LoginAttempt(key));attempt.fail(MAX_FAILURES,BLOCK_DURATION);attempts.save(attempt);}
    @Transactional public void success(String key){attempts.deleteById(key);}
}
