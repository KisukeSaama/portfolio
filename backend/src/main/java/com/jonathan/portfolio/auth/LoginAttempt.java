package com.jonathan.portfolio.auth;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name="login_attempt")
public class LoginAttempt {
    @Id @Column(name="attempt_key",length=64) private String key;
    @Column(nullable=false) private int failures;
    @Column(name="blocked_until") private Instant blockedUntil;
    @Column(name="updated_at",nullable=false) private Instant updatedAt=Instant.now();
    protected LoginAttempt() {}
    public LoginAttempt(String key){this.key=key;}
    public void fail(int maxFailures,java.time.Duration blockDuration){failures++;updatedAt=Instant.now();if(failures>=maxFailures)blockedUntil=updatedAt.plus(blockDuration);}
    public boolean blocked(){return blockedUntil!=null&&blockedUntil.isAfter(Instant.now());}
    public String getKey(){return key;} public int getFailures(){return failures;} public Instant getBlockedUntil(){return blockedUntil;}
}
