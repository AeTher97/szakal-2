package org.iaeste.szakal2.util;

import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

public class SharedPostgresContainer {

    private static final PostgreSQLContainer<?> postgreSQLContainer;

    static {
        postgreSQLContainer = new PostgreSQLContainer<>(DockerImageName.parse("postgres").withTag("16.0"));
        postgreSQLContainer.start();
    }

    public static PostgreSQLContainer<?> getInstance() {
        return postgreSQLContainer;
    }


}
