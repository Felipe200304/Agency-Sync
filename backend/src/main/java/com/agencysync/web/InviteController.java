package com.agencysync.web;

import com.agencysync.domain.AppUser;
import com.agencysync.domain.Brand;
import com.agencysync.domain.Invite;
import com.agencysync.domain.Model;
import com.agencysync.domain.UserRole;
import com.agencysync.repo.AppUserRepo;
import com.agencysync.repo.BrandRepo;
import com.agencysync.repo.InviteRepo;
import com.agencysync.repo.ModelRepo;
import com.agencysync.service.JwtService;
import com.agencysync.web.dto.AcceptInviteRequest;
import com.agencysync.web.dto.AuthResponse;
import com.agencysync.web.dto.AuthUser;
import com.agencysync.web.dto.InviteDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
class InviteController {

    private final ModelRepo models;
    private final BrandRepo brands;
    private final InviteRepo invites;
    private final AppUserRepo users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    InviteController(ModelRepo models, BrandRepo brands, InviteRepo invites, AppUserRepo users,
                     PasswordEncoder encoder, JwtService jwt) {
        this.models = models;
        this.brands = brands;
        this.invites = invites;
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    /** Agência gera um convite para o modelo (retorna o token; o front monta o link). */
    @PostMapping("/api/models/{modelId}/invite")
    @ResponseStatus(HttpStatus.CREATED)
    InviteDto create(@PathVariable UUID modelId) {
        Model model = models.findById(modelId).orElseThrow(() -> new NotFoundException("Modelo", modelId));
        Invite inv = newInvite();
        inv.setModel(model);
        return InviteDto.from(invites.save(inv));
    }

    /** Agência gera um convite para a marca criar o próprio login. */
    @PostMapping("/api/brands/{brandId}/invite")
    @ResponseStatus(HttpStatus.CREATED)
    InviteDto createForBrand(@PathVariable UUID brandId) {
        Brand brand = brands.findById(brandId).orElseThrow(() -> new NotFoundException("Marca", brandId));
        Invite inv = newInvite();
        inv.setBrand(brand);
        return InviteDto.from(invites.save(inv));
    }

    private Invite newInvite() {
        Invite inv = new Invite();
        inv.setToken(UUID.randomUUID().toString().replace("-", ""));
        inv.setUsed(false);
        return inv;
    }

    /** Público: dados do convite para a tela de cadastro. */
    @GetMapping("/api/invite/{token}")
    InviteDto info(@PathVariable String token) {
        return InviteDto.from(find(token));
    }

    /** Público: o modelo cria o próprio login a partir do convite. */
    @PostMapping("/api/invite/{token}/accept")
    AuthResponse accept(@PathVariable String token, @Valid @RequestBody AcceptInviteRequest req) {
        Invite inv = find(token);
        if (inv.isUsed()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Convite já utilizado");
        }
        String email = req.email().trim().toLowerCase();
        if (users.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado");
        }
        AppUser user = new AppUser();
        user.setEmail(email);
        user.setPasswordHash(encoder.encode(req.password()));
        if (inv.getBrand() != null) {
            user.setRole(UserRole.BRAND);
            user.setBrandId(inv.getBrand().getId());
        } else {
            user.setRole(UserRole.MODEL);
            user.setModelId(inv.getModel().getId());
        }
        users.save(user);

        inv.setUsed(true);
        invites.save(inv);

        return new AuthResponse(jwt.generate(user), AuthUser.from(user));
    }

    private Invite find(String token) {
        return invites.findByToken(token).orElseThrow(() -> new NotFoundException("Convite", token));
    }
}
