package com.taevas.clinic.security;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

import static org.junit.jupiter.api.Assertions.*;

class UserPrincipalTest {

    private static final String USER_ID = "550e8400-e29b-41d4-a716-446655440000";
    private static final String ROLE = "SUPERADMIN";
    private static final String TENANT_ID = "660e8400-e29b-41d4-a716-446655440001";

    @Test
    void constructor_setsFieldsCorrectly() {
        UserPrincipal principal = new UserPrincipal(USER_ID, ROLE, TENANT_ID);

        assertEquals(USER_ID, principal.getId());
        assertEquals(ROLE, principal.getRole());
        assertEquals(TENANT_ID, principal.getTenantId());
    }

    @Test
    void getAuthorities_returnsRolePrefixedAuthority() {
        UserPrincipal principal = new UserPrincipal(USER_ID, ROLE, TENANT_ID);

        Collection<? extends GrantedAuthority> authorities = principal.getAuthorities();

        assertEquals(1, authorities.size());
        assertEquals("ROLE_SUPERADMIN", authorities.iterator().next().getAuthority());
    }

    @Test
    void getUsername_returnsId() {
        UserPrincipal principal = new UserPrincipal(USER_ID, ROLE, TENANT_ID);

        assertEquals(USER_ID, principal.getUsername());
    }

    @Test
    void getPassword_returnsNull() {
        UserPrincipal principal = new UserPrincipal(USER_ID, ROLE, TENANT_ID);

        assertNull(principal.getPassword());
    }

    @Test
    void accountStatusMethods_returnTrue() {
        UserPrincipal principal = new UserPrincipal(USER_ID, ROLE, TENANT_ID);

        assertTrue(principal.isAccountNonExpired());
        assertTrue(principal.isAccountNonLocked());
        assertTrue(principal.isCredentialsNonExpired());
        assertTrue(principal.isEnabled());
    }
}
