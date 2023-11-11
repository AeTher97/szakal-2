package org.iaeste.szakal2;

import jakarta.annotation.PostConstruct;
import org.iaeste.szakal2.services.InitService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SzakalBackend {

    private final InitService initService;

    public SzakalBackend(InitService initService) {
        this.initService = initService;
    }

    public static void main(String[] args) {
        SpringApplication.run(SzakalBackend.class, args);
    }


    @PostConstruct
    public void initializeDatabase(){
        initService.initializeDatabase();
    }
}
