package com.agencysync.config;

import com.agencysync.domain.AppUser;
import com.agencysync.domain.UserRole;
import com.agencysync.repo.AppUserRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Define senhas reais para os usuários seed (que entram com hash 'PLACEHOLDER')
 * e garante um usuário CLIENT de exemplo. Idempotente — roda a cada startup.
 * Senha padrão de demonstração: "senha123".
 */
@Component
class DataInitializer implements CommandLineRunner {

    private static final String DEMO_PASSWORD = "senha123";

    private final AppUserRepo users;
    private final PasswordEncoder encoder;

    DataInitializer(AppUserRepo users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        users.findAll().forEach(u -> {
            if ("PLACEHOLDER".equals(u.getPasswordHash())) {
                u.setPasswordHash(encoder.encode(DEMO_PASSWORD));
                users.save(u);
            }
        });

        if (users.findByEmail("cliente@marca.com").isEmpty()) {
            AppUser brand = new AppUser();
            brand.setEmail("cliente@marca.com");
            brand.setPasswordHash(encoder.encode(DEMO_PASSWORD));
            brand.setRole(UserRole.BRAND);
            users.save(brand);
        }
    }
}
