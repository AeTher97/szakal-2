package org.iaeste.szakal2.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "database")
public class DatabaseProperties {

    String url;
    String username;
    String password;

}
