package com.jonathan.portfolio.security;

import com.jonathan.portfolio.common.exception.NotFoundException;
import com.jonathan.portfolio.user.*;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class CurrentAdmin {
    private final AdminUserRepository users;
    public CurrentAdmin(AdminUserRepository users){this.users=users;}
    public UUID id(Authentication authentication){return users.findByEmailIgnoreCase(authentication.getName()).orElseThrow(()->new NotFoundException("Administrateur introuvable.")).getId();}
}
