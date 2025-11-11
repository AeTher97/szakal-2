package org.iaeste.szakal2.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@Data
@EnableConfigurationProperties(JwtConfiguration.class)
@ConfigurationProperties(prefix = "jwt")
public class JwtConfiguration {
    private String issuer;
    private String secret;
    private String authExpirationTime;
    private String refreshExpirationTime;
    private String pushPrivateKey;
    private String pushPublicKey;
}


