package com.taevas.clinic.service.auth;

import java.time.Duration;

public interface TokenStore {
    void store(String key, String value, Duration ttl);
    String get(String key);
    void delete(String key);
}
