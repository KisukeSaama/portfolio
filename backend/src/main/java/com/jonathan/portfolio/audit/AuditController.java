package com.jonathan.portfolio.audit;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/admin/audit")
public class AuditController {
    private final AuditLogRepository logs;public AuditController(AuditLogRepository logs){this.logs=logs;}
    @GetMapping @Transactional(readOnly=true) public Page<AuditResponse> list(@PageableDefault(size=30) Pageable pageable){return logs.findAllByOrderByCreatedAtDesc(pageable).map(AuditResponse::from);}
}
