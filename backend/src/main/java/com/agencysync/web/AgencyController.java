package com.agencysync.web;

import com.agencysync.domain.Agency;
import com.agencysync.repo.AgencyRepo;
import com.agencysync.web.dto.AgencyDto;
import com.agencysync.web.dto.AgencyRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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
@RequestMapping("/api/agencies")
class AgencyController {

    private final AgencyRepo repo;

    AgencyController(AgencyRepo repo) {
        this.repo = repo;
    }

    @GetMapping
    List<AgencyDto> list() {
        return repo.findAll().stream().map(AgencyDto::from).toList();
    }

    @GetMapping("/{id}")
    AgencyDto get(@PathVariable UUID id) {
        return AgencyDto.from(repo.findById(id).orElseThrow(() -> new NotFoundException("Agência", id)));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    AgencyDto create(@Valid @RequestBody AgencyRequest req) {
        return AgencyDto.from(repo.save(req.applyTo(new Agency())));
    }

    @PutMapping("/{id}")
    AgencyDto update(@PathVariable UUID id, @Valid @RequestBody AgencyRequest req) {
        Agency agency = repo.findById(id).orElseThrow(() -> new NotFoundException("Agência", id));
        return AgencyDto.from(repo.save(req.applyTo(agency)));
    }
}
