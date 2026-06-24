package com.agencysync.web;

import com.agencysync.domain.AppUser;
import com.agencysync.repo.AppUserRepo;
import com.agencysync.service.JwtService;
import com.agencysync.web.dto.AuthResponse;
import com.agencysync.web.dto.AuthUser;
import com.agencysync.web.dto.LoginRequest;
import io.jsonwebtoken.JwtException;
import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
class AuthController {

    private final AppUserRepo users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    AuthController(AppUserRepo users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @PostMapping("/login")
    AuthResponse login(@Valid @RequestBody LoginRequest req) {
        AppUser user = users.findByEmail(req.email().trim().toLowerCase())
                .orElseThrow(UnauthorizedException::new);
        if (!encoder.matches(req.password(), user.getPasswordHash())) {
            throw new UnauthorizedException();
        }
        return new AuthResponse(jwt.generate(user), AuthUser.from(user));
    }

    @GetMapping("/me")
    AuthUser me(@RequestHeader("Authorization") String authorization) {
        String token = authorization.replaceFirst("(?i)^Bearer ", "");
        UUID uid;
        try {
            uid = UUID.fromString(jwt.parse(token).get("uid", String.class));
        } catch (JwtException | IllegalArgumentException e) {
            throw new UnauthorizedException();
        }
        return AuthUser.from(users.findById(uid).orElseThrow(UnauthorizedException::new));
    }
}
