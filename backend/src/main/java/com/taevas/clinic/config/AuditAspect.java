package com.taevas.clinic.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taevas.clinic.model.AuditLog;
import com.taevas.clinic.repository.AuditLogRepository;
import com.taevas.clinic.security.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Map;
import java.util.UUID;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    private static final Map<String, String> HTTP_METHOD_TO_ACTION = Map.of(
            "POST", "CREATE",
            "PUT", "UPDATE",
            "PATCH", "UPDATE",
            "DELETE", "DELETE",
            "GET", "READ"
    );

    @Around("execution(* com.taevas.clinic.controller.superadmin..*(..))")
    public Object auditSuperAdminActions(ProceedingJoinPoint joinPoint) throws Throwable {
        HttpServletRequest request = getCurrentRequest();
        if (request == null) {
            return joinPoint.proceed();
        }

        String httpMethod = request.getMethod();
        String action = HTTP_METHOD_TO_ACTION.getOrDefault(httpMethod, httpMethod);

        // Skip auditing GET requests
        if ("READ".equals(action)) {
            return joinPoint.proceed();
        }

        Object result;
        try {
            result = joinPoint.proceed();
        } catch (Throwable ex) {
            // Still attempt to log the failed action
            try {
                saveAuditLog(joinPoint, request, httpMethod, action, null);
            } catch (Exception auditEx) {
                log.error("Failed to save audit log for failed request", auditEx);
            }
            throw ex;
        }

        try {
            saveAuditLog(joinPoint, request, httpMethod, action, result);
        } catch (Exception ex) {
            log.error("Failed to save audit log", ex);
        }

        return result;
    }

    private void saveAuditLog(ProceedingJoinPoint joinPoint, HttpServletRequest request,
                               String httpMethod, String action, Object result) {
        UUID userId = extractUserId();
        String entityType = extractEntityType(joinPoint);
        String ipAddress = extractIpAddress(request);
        String userAgent = request.getHeader("User-Agent");
        String requestPath = request.getRequestURI();

        String newValue = null;
        if ("POST".equals(httpMethod) || "PUT".equals(httpMethod) || "PATCH".equals(httpMethod)) {
            newValue = extractRequestBody(joinPoint);
        }

        String responseBody = null;
        if (result != null) {
            try {
                responseBody = objectMapper.writeValueAsString(result);
            } catch (Exception ex) {
                log.debug("Could not serialize response body for audit", ex);
            }
        }

        // Try to extract entity ID from the request path
        String entityId = extractEntityIdFromPath(requestPath);

        AuditLog auditLog = AuditLog.builder()
                .userId(userId)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .oldValue(newValue)
                .newValue(responseBody)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .build();

        auditLogRepository.save(auditLog);
        log.debug("Audit log saved: action={}, entityType={}, userId={}", action, entityType, userId);
    }

    private UUID extractUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal principal) {
                return UUID.fromString(principal.getId());
            }
        } catch (Exception ex) {
            log.debug("Could not extract user ID from security context", ex);
        }
        return null;
    }

    private String extractEntityType(ProceedingJoinPoint joinPoint) {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        // Remove "Controller" suffix and convert to uppercase
        // e.g., CountryController -> COUNTRY
        return className.replace("Controller", "").toUpperCase();
    }

    private String extractIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private String extractRequestBody(ProceedingJoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        for (Object arg : args) {
            if (arg == null) continue;
            // Skip HttpServletRequest, HttpServletResponse, and primitive wrappers
            if (arg instanceof HttpServletRequest) continue;
            if (arg instanceof jakarta.servlet.http.HttpServletResponse) continue;
            if (arg instanceof String || arg instanceof Number || arg instanceof UUID) continue;
            if (arg instanceof org.springframework.security.core.Authentication) continue;

            try {
                return objectMapper.writeValueAsString(arg);
            } catch (Exception ex) {
                log.debug("Could not serialize request body for audit", ex);
            }
        }
        return null;
    }

    private String extractEntityIdFromPath(String path) {
        if (path == null) return null;
        String[] segments = path.split("/");
        // Try to find a UUID in the path segments (typically the last segment for single-entity operations)
        for (int i = segments.length - 1; i >= 0; i--) {
            try {
                UUID.fromString(segments[i]);
                return segments[i];
            } catch (IllegalArgumentException ignored) {
                // Not a UUID, continue
            }
        }
        return null;
    }

    private HttpServletRequest getCurrentRequest() {
        try {
            ServletRequestAttributes attributes =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                return attributes.getRequest();
            }
        } catch (Exception ex) {
            log.debug("Could not get current HTTP request", ex);
        }
        return null;
    }
}
