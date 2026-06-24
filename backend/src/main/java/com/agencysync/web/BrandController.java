package com.agencysync.web;

import com.agencysync.domain.Brand;
import com.agencysync.repo.BrandRepo;
import com.agencysync.web.dto.BrandDto;
import com.agencysync.web.dto.BrandRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
class BrandController {

    private final BrandRepo repo;

    BrandController(BrandRepo repo) {
        this.repo = repo;
    }

    @GetMapping
    List<BrandDto> list() {
        return repo.findAll().stream().map(BrandDto::from).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    BrandDto create(@Valid @RequestBody BrandRequest req) {
        return BrandDto.from(repo.save(req.applyTo(new Brand())));
    }
}
