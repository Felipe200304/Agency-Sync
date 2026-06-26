package com.agencysync.web;

import com.agencysync.domain.Agency;
import com.agencysync.domain.Model;
import com.agencysync.domain.ModelAgencyLink;
import com.agencysync.domain.ModelPhoto;
import com.agencysync.repo.AgencyRepo;
import com.agencysync.repo.LinkRepo;
import com.agencysync.repo.ModelPhotoRepo;
import com.agencysync.repo.ModelRepo;
import com.agencysync.web.dto.LinkDto;
import com.agencysync.web.dto.LinkRequest;
import com.agencysync.web.dto.ModelDto;
import com.agencysync.web.dto.ModelPhotoDto;
import com.agencysync.web.dto.ModelPhotosRequest;
import com.agencysync.web.dto.ModelRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/models")
class ModelController {

    private final ModelRepo models;
    private final AgencyRepo agencies;
    private final LinkRepo links;
    private final ModelPhotoRepo photos;

    ModelController(ModelRepo models, AgencyRepo agencies, LinkRepo links, ModelPhotoRepo photos) {
        this.models = models;
        this.agencies = agencies;
        this.links = links;
        this.photos = photos;
    }

    @GetMapping
    List<ModelDto> list() {
        return models.findAll().stream().map(ModelDto::from).toList();
    }

    @GetMapping("/{id}")
    ModelDto get(@PathVariable UUID id) {
        return ModelDto.from(findModel(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    ModelDto create(@Valid @RequestBody ModelRequest req) {
        Agency base = req.baseAgencyId() == null ? null : findAgency(req.baseAgencyId());
        return ModelDto.from(models.save(req.applyTo(new Model(), base)));
    }

    // --- Vínculos multi-agência (papel + comissão configurável) ---

    @GetMapping("/{id}/agencies")
    List<LinkDto> listLinks(@PathVariable UUID id) {
        findModel(id);
        return links.findByModelId(id).stream().map(LinkDto::from).toList();
    }

    @PostMapping("/{id}/agencies")
    @ResponseStatus(HttpStatus.CREATED)
    LinkDto addLink(@PathVariable UUID id, @Valid @RequestBody LinkRequest req) {
        Model model = findModel(id);
        Agency agency = findAgency(req.agencyId());
        return LinkDto.from(links.save(req.applyTo(new ModelAgencyLink(), model, agency)));
    }

    @PutMapping("/{id}/agencies/{linkId}")
    LinkDto updateLink(@PathVariable UUID id, @PathVariable UUID linkId, @Valid @RequestBody LinkRequest req) {
        Model model = findModel(id);
        Agency agency = findAgency(req.agencyId());
        ModelAgencyLink link = links.findById(linkId).orElseThrow(() -> new NotFoundException("Vínculo", linkId));
        return LinkDto.from(links.save(req.applyTo(link, model, agency)));
    }

    // --- Galeria (book): muitas fotos por modelo ---

    @GetMapping("/{id}/photos")
    List<ModelPhotoDto> listPhotos(@PathVariable UUID id) {
        findModel(id);
        return photos.findByModelIdOrderByPositionAsc(id).stream().map(ModelPhotoDto::from).toList();
    }

    /** Adiciona uma ou várias fotos de uma vez; cada uma é anexada ao fim da galeria. */
    @PostMapping("/{id}/photos")
    @ResponseStatus(HttpStatus.CREATED)
    List<ModelPhotoDto> addPhotos(@PathVariable UUID id, @Valid @RequestBody ModelPhotosRequest req) {
        Model model = findModel(id);
        int position = (int) photos.countByModelId(id);
        List<ModelPhoto> saved = new java.util.ArrayList<>();
        for (String url : req.urls()) {
            if (url == null || url.isBlank()) continue;
            ModelPhoto photo = new ModelPhoto();
            photo.setModel(model);
            photo.setUrl(url);
            photo.setPosition(position++);
            saved.add(photos.save(photo));
        }
        return saved.stream().map(ModelPhotoDto::from).toList();
    }

    @DeleteMapping("/{id}/photos/{photoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void deletePhoto(@PathVariable UUID id, @PathVariable UUID photoId) {
        findModel(id);
        if (photos.deleteByIdAndModelId(photoId, id) == 0) throw new NotFoundException("Foto", photoId);
    }

    private Model findModel(UUID id) {
        return models.findById(id).orElseThrow(() -> new NotFoundException("Modelo", id));
    }

    private Agency findAgency(UUID id) {
        return agencies.findById(id).orElseThrow(() -> new NotFoundException("Agência", id));
    }
}
