package com.jonathan.portfolio.user;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "admin_user")
public class AdminUser {
    @Id @UuidGenerator private UUID id;
    @Column(nullable = false, unique = true, length = 254) private String email;
    @Column(name = "password_hash", nullable = false, length = 100) private String passwordHash;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 32) private AdminRole role = AdminRole.ADMIN;
    @Column(nullable = false) private boolean enabled = true;
    @Column(name = "created_at", nullable = false) private Instant createdAt = Instant.now();
    @Column(name = "updated_at", nullable = false) private Instant updatedAt = Instant.now();

    protected AdminUser() {}
    public AdminUser(String email, String passwordHash) { this.email = email; this.passwordHash = passwordHash; }
    @PreUpdate void touch() { updatedAt = Instant.now(); }
    public UUID getId() { return id; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public AdminRole getRole() { return role; }
    public boolean isEnabled() { return enabled; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; this.updatedAt = Instant.now(); }
    public void setEnabled(boolean enabled) { this.enabled = enabled; this.updatedAt = Instant.now(); }
}
