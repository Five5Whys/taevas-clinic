package com.taevas.clinic.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    private static final String SECRET = "dGVzdC1zZWNyZXQta2V5LWZvci10YWV2YXMtY2xpbmljLXVuaXQtdGVzdHMtMjAyNC1sb25nLWVub3VnaC1mb3ItaG1hYy1zaGEyNTY";
    private static final long ACCESS_TOKEN_EXPIRY = 3600000L;  // 1 hour
    private static final long REFRESH_TOKEN_EXPIRY = 604800000L; // 7 days

    private static final String USER_ID = "550e8400-e29b-41d4-a716-446655440000";
    private static final String ROLE = "SUPERADMIN";
    private static final String TENANT_ID = "660e8400-e29b-41d4-a716-446655440001";

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider(SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY);
    }

    @Test
    void generateAccessToken_createsValidJwt() {
        String token = jwtTokenProvider.generateAccessToken(USER_ID, ROLE, TENANT_ID);

        assertNotNull(token);
        assertFalse(token.isBlank());
        // JWT has 3 dot-separated parts
        assertEquals(3, token.split("\\.").length);
    }

    @Test
    void generateRefreshToken_createsValidJwt() {
        String token = jwtTokenProvider.generateRefreshToken(USER_ID);

        assertNotNull(token);
        assertFalse(token.isBlank());
        assertEquals(3, token.split("\\.").length);
    }

    @Test
    void validateToken_returnsTrueForValidToken() {
        String token = jwtTokenProvider.generateAccessToken(USER_ID, ROLE, TENANT_ID);

        assertTrue(jwtTokenProvider.validateToken(token));
    }

    @Test
    void validateToken_returnsFalseForInvalidToken() {
        assertFalse(jwtTokenProvider.validateToken("invalid.token.here"));
    }

    @Test
    void validateToken_returnsFalseForExpiredToken() {
        // Create a provider with 0ms expiry to force immediate expiration
        JwtTokenProvider expiredProvider = new JwtTokenProvider(SECRET, 0L, 0L);
        String token = expiredProvider.generateAccessToken(USER_ID, ROLE, TENANT_ID);

        // Token generated with 0ms expiry is already expired
        assertFalse(jwtTokenProvider.validateToken(token));
    }

    @Test
    void validateToken_returnsFalseForTokenSignedWithDifferentKey() {
        String differentSecret = "YW5vdGhlci1zZWNyZXQta2V5LWZvci10YWV2YXMtY2xpbmljLXVuaXQtdGVzdHMtMjAyNC1kaWZmZXJlbnQta2V5LWhtYWM";
        SecretKey differentKey = Keys.hmacShaKeyFor(differentSecret.getBytes(StandardCharsets.UTF_8));

        String token = Jwts.builder()
                .subject(USER_ID)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(differentKey)
                .compact();

        assertFalse(jwtTokenProvider.validateToken(token));
    }

    @Test
    void validateToken_returnsFalseForNullToken() {
        assertFalse(jwtTokenProvider.validateToken(null));
    }

    @Test
    void getUserIdFromToken_extractsCorrectUserId() {
        String token = jwtTokenProvider.generateAccessToken(USER_ID, ROLE, TENANT_ID);

        assertEquals(USER_ID, jwtTokenProvider.getUserIdFromToken(token));
    }

    @Test
    void getRoleFromToken_extractsCorrectRole() {
        String token = jwtTokenProvider.generateAccessToken(USER_ID, ROLE, TENANT_ID);

        assertEquals(ROLE, jwtTokenProvider.getRoleFromToken(token));
    }

    @Test
    void getTenantIdFromToken_extractsCorrectTenantId() {
        String token = jwtTokenProvider.generateAccessToken(USER_ID, ROLE, TENANT_ID);

        assertEquals(TENANT_ID, jwtTokenProvider.getTenantIdFromToken(token));
    }

    @Test
    void getTenantIdFromToken_returnsNullWhenTenantIdIsNull() {
        String token = jwtTokenProvider.generateAccessToken(USER_ID, ROLE, null);

        assertNull(jwtTokenProvider.getTenantIdFromToken(token));
    }
}
