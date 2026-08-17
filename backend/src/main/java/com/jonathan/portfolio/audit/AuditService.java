package com.jonathan.portfolio.audit;

import com.jonathan.portfolio.project.domain.Project;
import com.jonathan.portfolio.user.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
    private final AuditLogRepository logs; private final AdminUserRepository users;
    public AuditService(AuditLogRepository logs, AdminUserRepository users){this.logs=logs;this.users=users;}
    public void record(AuditAction action, UUID actorId, Project project, String safeDetails, HttpServletRequest request){
        AdminUser actor=actorId==null?null:users.findById(actorId).orElse(null);
        String correlation=request==null?null:String.valueOf(request.getAttribute("correlationId"));
        logs.save(new AuditLog(action,actor,project,safeDetails,correlation));
    }
}
