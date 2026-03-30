package com.taevas.clinic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class TaevasClinicApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaevasClinicApplication.class, args);
    }
}
