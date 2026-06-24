package com.agencysync.web.dto;

import jakarta.validation.constraints.NotBlank;

/** Decisão do modelo sobre um trabalho: confirmado | recusado. */
public record DecisionRequest(@NotBlank String decision) {}
