package com.neurofleetx;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
@EntityScan("com.neurofleetx.entity")
@ComponentScan("com.neurofleetx")
@EnableJpaRepositories("com.neurofleetx.repository")
public class NeuroFleetXApplication {
    public static void main(String[] args) {
        SpringApplication.run(NeuroFleetXApplication.class, args);
    }
}
