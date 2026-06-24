package com.agencysync.web;

import com.agencysync.domain.CalendarEvent;
import com.agencysync.domain.Model;
import com.agencysync.repo.EventRepo;
import com.agencysync.repo.ModelRepo;
import com.agencysync.service.AgendaExcelExporter;
import com.agencysync.web.dto.EventDto;
import com.agencysync.web.dto.EventRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/models/{modelId}/agenda")
class AgendaController {

    private static final String XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    private final ModelRepo models;
    private final EventRepo events;
    private final AgendaExcelExporter exporter;

    AgendaController(ModelRepo models, EventRepo events, AgendaExcelExporter exporter) {
        this.models = models;
        this.events = events;
        this.exporter = exporter;
    }

    @GetMapping
    List<EventDto> list(@PathVariable UUID modelId) {
        findModel(modelId);
        return events.findByModelIdOrderByEventDateAscStartTimeAsc(modelId).stream().map(EventDto::from).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    EventDto add(@PathVariable UUID modelId, @Valid @RequestBody EventRequest req) {
        Model model = findModel(modelId);
        return EventDto.from(events.save(req.applyTo(new CalendarEvent(), model)));
    }

    @GetMapping("/export")
    ResponseEntity<byte[]> export(@PathVariable UUID modelId) {
        Model model = findModel(modelId);
        byte[] body = exporter.export(model, events.findByModelIdOrderByEventDateAscStartTimeAsc(modelId));
        String file = "agenda-" + model.getId() + ".xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file + "\"")
                .contentType(MediaType.parseMediaType(XLSX))
                .body(body);
    }

    private Model findModel(UUID id) {
        return models.findById(id).orElseThrow(() -> new NotFoundException("Modelo", id));
    }
}
