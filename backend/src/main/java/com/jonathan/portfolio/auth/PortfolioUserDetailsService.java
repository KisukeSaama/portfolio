package com.jonathan.portfolio.auth;

import com.jonathan.portfolio.user.AdminUserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class PortfolioUserDetailsService implements UserDetailsService {
    private final AdminUserRepository users; public PortfolioUserDetailsService(AdminUserRepository users){this.users=users;}
    @Override public UserDetails loadUserByUsername(String username){var user=users.findByEmailIgnoreCase(username).orElseThrow(()->new UsernameNotFoundException("Invalid credentials"));return User.withUsername(user.getEmail()).password(user.getPasswordHash()).roles(user.getRole().name()).disabled(!user.isEnabled()).build();}
}
