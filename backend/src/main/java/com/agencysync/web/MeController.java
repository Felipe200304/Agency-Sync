package com.agencysync.web;

import com.agencysync.domain.AppUser;
import com.agencysync.domain.Brand;
import com.agencysync.domain.CalendarEvent;
import com.agencysync.domain.Casting;
import com.agencysync.domain.CastingModel;
import com.agencysync.domain.FinanceRecord;
import com.agencysync.repo.AppUserRepo;
import com.agencysync.repo.BrandRepo;
import com.agencysync.repo.CastingModelRepo;
import com.agencysync.repo.CastingRepo;
import com.agencysync.repo.EventRepo;
import com.agencysync.repo.FinanceRepo;
import com.agencysync.repo.ModelRepo;
import com.agencysync.service.NotificationService;
import com.agencysync.web.dto.AuthUser;
import com.agencysync.web.dto.BlockRequest;
import com.agencysync.web.dto.CastingDto;
import com.agencysync.web.dto.CastingRequest;
import com.agencysync.web.dto.DecisionRequest;
import com.agencysync.web.dto.EventDto;
import com.agencysync.web.dto.FinanceRecordDto;
import com.agencysync.web.dto.MeFinanceDto;
import com.agencysync.web.dto.MeJobDto;
import com.agencysync.web.dto.PasswordChangeRequest;
import com.agencysync.web.dto.StatusRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import java.util.UUID;

/**
 * Endpoints do usuário autenticado ("eu"). Resolvem o usuário pelo token
 * (SecurityContext), garantindo que cada um acesse apenas os próprios dados.
 */
@RestController
@RequestMapping("/api/me")
@Transactional
class MeController {

    private final AppUserRepo users;
    private final ModelRepo models;
    private final EventRepo events;
    private final CastingModelRepo castingModels;
    private final FinanceRepo finance;
    private final CastingRepo castings;
    private final BrandRepo brands;
    private final NotificationService notifications;
    private final PasswordEncoder encoder;

    MeController(AppUserRepo users, ModelRepo models, EventRepo events,
                 CastingModelRepo castingModels, FinanceRepo finance, CastingRepo castings,
                 BrandRepo brands, NotificationService notifications, PasswordEncoder encoder) {
        this.users = users;
        this.models = models;
        this.events = events;
        this.castingModels = castingModels;
        this.finance = finance;
        this.castings = castings;
        this.brands = brands;
        this.notifications = notifications;
        this.encoder = encoder;
    }

    @GetMapping
    AuthUser me(Principal principal) {
        return AuthUser.from(current(principal));
    }

    // --- Agenda do próprio modelo ---

    @GetMapping("/agenda")
    List<EventDto> agenda(Principal principal) {
        UUID modelId = requireModelId(principal);
        return events.findByModelIdOrderByEventDateAscStartTimeAsc(modelId).stream().map(EventDto::from).toList();
    }

    /** Bloqueia um dia (indisponibilidade) na própria agenda. */
    @PostMapping("/agenda/block")
    @ResponseStatus(HttpStatus.CREATED)
    EventDto block(Principal principal, @Valid @RequestBody BlockRequest req) {
        UUID modelId = requireModelId(principal);
        CalendarEvent e = new CalendarEvent();
        e.setModel(models.getReferenceById(modelId));
        e.setType("indisponivel");
        e.setTitle(req.title() == null || req.title().isBlank() ? "Indisponível" : req.title());
        e.setEventDate(req.date());
        return EventDto.from(events.save(e));
    }

    /** Remove um bloqueio próprio (só eventos de indisponibilidade do próprio modelo). */
    @DeleteMapping("/agenda/{eventId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void removeBlock(Principal principal, @PathVariable UUID eventId) {
        UUID modelId = requireModelId(principal);
        CalendarEvent e = events.findById(eventId).orElseThrow(() -> new NotFoundException("Evento", eventId));
        if (!e.getModel().getId().equals(modelId) || !"indisponivel".equals(e.getType())) {
            throw new NotFoundException("Evento", eventId);
        }
        events.delete(e);
    }

    // --- Trabalhos enviados ao modelo ---

    @GetMapping("/jobs")
    List<MeJobDto> jobs(Principal principal) {
        UUID modelId = requireModelId(principal);
        return castingModels.findByModelIdOrderByCreatedAtDesc(modelId).stream().map(MeJobDto::from).toList();
    }

    /** Modelo confirma ou recusa um trabalho. */
    @PutMapping("/jobs/{castingId}")
    MeJobDto decideJob(Principal principal, @PathVariable UUID castingId, @Valid @RequestBody DecisionRequest req) {
        UUID modelId = requireModelId(principal);
        CastingModel cm = castingModels.findByModelIdAndCastingId(modelId, castingId)
                .orElseThrow(() -> new NotFoundException("Trabalho", castingId));
        cm.setModelDecision(req.decision());
        return MeJobDto.from(castingModels.save(cm));
    }

    // --- Castings da própria marca (portal do cliente) ---

    @GetMapping("/castings")
    List<CastingDto> myCastings(Principal principal) {
        UUID brandId = requireBrandId(principal);
        return castings.findByBrandIdOrderByCreatedAtDesc(brandId).stream().map(CastingDto::from).toList();
    }

    /** The brand requests a casting — automatically linked to its own brand. */
    @PostMapping("/castings")
    @ResponseStatus(HttpStatus.CREATED)
    CastingDto createCasting(Principal principal, @Valid @RequestBody CastingRequest req) {
        Brand brand = brands.getReferenceById(requireBrandId(principal));
        Casting casting = req.applyTo(new Casting(), brand);
        casting.setStatus("solicitado");
        Casting saved = castings.save(casting);
        notifications.newCastingToAgency(saved);
        return CastingDto.from(saved);
    }

    /** The brand approves/rejects a model — only on castings it owns. */
    @PutMapping("/castings/{castingId}/models/{modelId}")
    CastingDto decideModel(Principal principal, @PathVariable UUID castingId,
                           @PathVariable UUID modelId, @Valid @RequestBody StatusRequest req) {
        Casting casting = requireOwnCasting(principal, castingId);
        CastingModel cm = casting.getModels().stream()
                .filter(m -> m.getModel().getId().equals(modelId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Model in casting", modelId));
        cm.setStatus(req.status());
        Casting saved = castings.save(casting);
        if ("aprovado".equals(req.status())) {
            notifications.workConfirmedToModel(saved, cm.getModel());
        }
        return CastingDto.from(saved);
    }

    /** Loads a casting only if it belongs to the logged-in brand (404 otherwise). */
    private Casting requireOwnCasting(Principal principal, UUID castingId) {
        UUID brandId = requireBrandId(principal);
        Casting casting = castings.findById(castingId)
                .orElseThrow(() -> new NotFoundException("Casting", castingId));
        if (casting.getBrand() == null || !casting.getBrand().getId().equals(brandId)) {
            throw new NotFoundException("Casting", castingId);
        }
        return casting;
    }

    // --- Finanças do modelo ---

    @GetMapping("/finance")
    MeFinanceDto myFinance(Principal principal) {
        UUID modelId = requireModelId(principal);
        List<FinanceRecord> rs = finance.findByModelIdOrderByEventDateDesc(modelId);

        BigDecimal gross = BigDecimal.ZERO, netReceived = BigDecimal.ZERO,
                netPending = BigDecimal.ZERO, commission = BigDecimal.ZERO;
        for (FinanceRecord r : rs) {
            gross = gross.add(r.getCachet());
            commission = commission.add(r.agencyCommission());
            if ("pago".equals(r.getStatus())) netReceived = netReceived.add(r.modelValue());
            else netPending = netPending.add(r.modelValue());
        }
        var summary = new MeFinanceDto.Summary(rs.size(), gross, netReceived, netPending, commission);
        return new MeFinanceDto(summary, rs.stream().map(FinanceRecordDto::from).toList());
    }

    // --- conta ---

    /** Troca a própria senha (qualquer papel). */
    @PutMapping("/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void changePassword(Principal principal, @Valid @RequestBody PasswordChangeRequest req) {
        AppUser user = current(principal);
        if (!encoder.matches(req.currentPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senha atual incorreta");
        }
        user.setPasswordHash(encoder.encode(req.newPassword()));
        users.save(user);
    }

    // --- helpers ---

    private AppUser current(Principal principal) {
        return users.findByEmail(principal.getName()).orElseThrow(UnauthorizedException::new);
    }

    private UUID requireModelId(Principal principal) {
        UUID modelId = current(principal).getModelId();
        if (modelId == null) throw new NotFoundException("Modelo do usuário", principal.getName());
        return modelId;
    }

    private UUID requireBrandId(Principal principal) {
        UUID brandId = current(principal).getBrandId();
        if (brandId == null) throw new NotFoundException("Marca do usuário", principal.getName());
        return brandId;
    }
}
