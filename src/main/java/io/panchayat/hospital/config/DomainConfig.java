package io.panchayat.hospital.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;


@Configuration
@EntityScan("io.panchayat.hospital.domain")
@EnableJpaRepositories("io.panchayat.hospital.repos")
@EnableTransactionManagement
public class DomainConfig {
}
