package com.jonathan.portfolio.common.api;

import com.jonathan.portfolio.common.exception.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.LinkedHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    @ExceptionHandler(NotFoundException.class)
    ResponseEntity<ApiError> notFound(NotFoundException ex, HttpServletRequest request) { return response(HttpStatus.NOT_FOUND, "not_found", ex.getMessage(), request); }
    @ExceptionHandler(ConflictException.class)
    ResponseEntity<ApiError> conflict(ConflictException ex, HttpServletRequest request) { return response(HttpStatus.CONFLICT, "conflict", ex.getMessage(), request); }
    @ExceptionHandler(InvalidOperationException.class)
    ResponseEntity<ApiError> invalid(InvalidOperationException ex, HttpServletRequest request) { return response(HttpStatus.UNPROCESSABLE_CONTENT, "invalid_operation", ex.getMessage(), request); }
    @ExceptionHandler(AccessDeniedException.class)
    ResponseEntity<ApiError> denied(HttpServletRequest request) { return response(HttpStatus.FORBIDDEN, "forbidden", "This action is not allowed.", request); }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiError> validation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        var fields = new LinkedHashMap<String,String>();
        ex.getBindingResult().getFieldErrors().forEach(error -> fields.putIfAbsent(error.getField(), error.getDefaultMessage()));
        var body = new ApiError("validation_error", "Some fields need to be corrected.", correlation(request), java.time.Instant.now(), fields);
        return ResponseEntity.badRequest().body(body);
    }
    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiError> unexpected(Exception ex, HttpServletRequest request) {
        log.error("Unexpected API error, correlationId={}", correlation(request), ex);
        return response(HttpStatus.INTERNAL_SERVER_ERROR, "internal_error", "An unexpected error occurred.", request);
    }
    private ResponseEntity<ApiError> response(HttpStatus status, String code, String message, HttpServletRequest request) { return ResponseEntity.status(status).body(ApiError.of(code, message, correlation(request))); }
    private String correlation(HttpServletRequest request) { var value=request.getAttribute("correlationId"); return value == null ? "unknown" : value.toString(); }
}
