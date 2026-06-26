package com.agencysync.config;

import com.agencysync.domain.AppUser;
import com.agencysync.domain.UserRole;
import com.agencysync.repo.AppUserRepo;
import com.agencysync.repo.BrandRepo;
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
    private final BrandRepo brands;
    private final PasswordEncoder encoder;

    DataInitializer(AppUserRepo users, BrandRepo brands, PasswordEncoder encoder) {
        this.users = users;
        this.brands = brands;
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

        // Usuário BRAND de exemplo, vinculado à primeira marca existente (se houver),
        // para o portal do cliente já abrir escopado. Idempotente.
        AppUser brandUser = users.findByEmail("cliente@marca.com").orElseGet(() -> {
            AppUser u = new AppUser();
            u.setEmail("cliente@marca.com");
            u.setPasswordHash(encoder.encode(DEMO_PASSWORD));
            u.setRole(UserRole.BRAND);
            return u;
        });
        if (brandUser.getBrandId() == null) {
            brands.findAll().stream().findFirst().ifPresent(b -> brandUser.setBrandId(b.getId()));
        }
        users.save(brandUser);
    }
}
