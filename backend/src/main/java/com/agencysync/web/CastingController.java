package com.agencysync.web;

import com.agencysync.domain.Brand;
import com.agencysync.domain.Casting;
import com.agencysync.domain.CastingModel;
import com.agencysync.domain.Model;
import com.agencysync.repo.BrandRepo;
import com.agencysync.repo.CastingRepo;
import com.agencysync.repo.ModelRepo;
import com.agencysync.service.NotificationService;
import com.agencysync.web.dto.AddModelsRequest;
import com.agencysync.web.dto.CastingDto;
import com.agencysync.web.dto.CastingRequest;
import com.agencysync.web.dto.StatusRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/castings")
@Transactional
class CastingController {

    private final CastingRepo castings;
    private final ModelRepo models;
    private final BrandRepo brands;
    private final NotificationService notifications;

    CastingController(CastingRepo castings, ModelRepo models, BrandRepo brands, NotificationService notifications) {
        this.castings = castings;
        this.models = models;
        this.brands = brands;
        this.notifications = notifications;
    }

    @GetMapping
    List<CastingDto> list() {
        return castings.findAllByOrderByCreatedAtDesc().stream().map(CastingDto::from).toList();
    }

    @GetMapping("/{id}")
    CastingDto get(@PathVariable UUID id) {
        return CastingDto.from(find(id));
    }

    /** Solicitar casting — entra como 'solicitado'. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    CastingDto create(@Valid @RequestBody CastingRequest req) {
        Brand brand = req.brandId() == null ? null
                : brands.findById(req.brandId()).orElseThrow(() -> new NotFoundException("Marca", req.brandId()));
        Casting casting = req.applyTo(new Casting(), brand);
        casting.setStatus("solicitado");
        Casting saved = castings.save(casting);
        notifications.newCastingToAgency(saved);
        return CastingDto.from(saved);
    }

    /** Atualiza o status do casting (avança no pipeline). */
    @PutMapping("/{id}/status")
    CastingDto updateStatus(@PathVariable UUID id, @Valid @RequestBody StatusRequest req) {
        Casting casting = find(id);
        casting.setStatus(req.status());
        return CastingDto.from(castings.save(casting));
    }

    /** Enviar modelos ao casting (booker seleciona do banco). */
    @PostMapping("/{id}/models")
    CastingDto addModels(@PathVariable UUID id, @Valid @RequestBody AddModelsRequest req) {
        Casting casting = find(id);
        List<Model> added = new ArrayList<>();
        for (UUID modelId : req.modelIds()) {
            boolean already = casting.getModels().stream().anyMatch(cm -> cm.getModel().getId().equals(modelId));
            if (already) continue;
            Model model = models.findById(modelId).orElseThrow(() -> new NotFoundException("Modelo", modelId));
            CastingModel cm = new CastingModel();
            cm.setCasting(casting);
            cm.setModel(model);
            cm.setStatus("enviado");
            cm.setModelDecision("pendente");
            casting.getModels().add(cm);
            added.add(model);
        }
        boolean earlyStage = "solicitado".equals(casting.getStatus()) || "em-analise".equals(casting.getStatus());
        if (!casting.getModels().isEmpty() && earlyStage) {
            casting.setStatus("modelos-enviados");
        }
        Casting saved = castings.save(casting);
        added.forEach(m -> notifications.castingToModel(saved, m));
        return CastingDto.from(saved);
    }

    /** Marca aprova/reprova um modelo do casting. */
    @PutMapping("/{id}/models/{modelId}")
    CastingDto decideModel(@PathVariable UUID id, @PathVariable UUID modelId, @Valid @RequestBody StatusRequest req) {
        Casting casting = find(id);
        CastingModel cm = casting.getModels().stream()
                .filter(m -> m.getModel().getId().equals(modelId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Modelo no casting", modelId));
        cm.setStatus(req.status());
        Casting saved = castings.save(casting);
        if ("aprovado".equals(req.status())) {
            notifications.workConfirmedToModel(saved, cm.getModel());
        }
        return CastingDto.from(saved);
    }

    private Casting find(UUID id) {
        return castings.findById(id).orElseThrow(() -> new NotFoundException("Casting", id));
    }
}
