package com.taevas.clinic.service.auth;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory token store for development without Redis.
 * Tokens are lost on restart — NOT for production.
 */
@Slf4j
@Component
@Profile({"dev", "local", "prod"})
public class InMemoryTokenStore implements TokenStore {

    private final Map<String, String> store = new ConcurrentHashMap<>();

    public InMemoryTokenStore() {
        log.info("Using in-memory token store (dev mode, no Redis required)");
    }

    @Override
    public void store(String key, String value, Duration ttl) {
        store.put(key, value);
    }

    @Override
    public String get(String key) {
        return store.get(key);
    }

    @Override
    public void delete(String key) {
        store.remove(key);
    }
}
