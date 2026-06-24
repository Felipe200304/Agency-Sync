package com.agencysync.web.dto;

import jakarta.validation.constraints.NotBlank;

/** Atualização de status (casting ou modelo no casting). */
public record StatusRequest(@NotBlank String status) {}
