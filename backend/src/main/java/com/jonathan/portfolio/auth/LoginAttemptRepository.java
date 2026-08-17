package com.jonathan.portfolio.auth;
import org.springframework.data.jpa.repository.JpaRepository;
public interface LoginAttemptRepository extends JpaRepository<LoginAttempt,String> {}
