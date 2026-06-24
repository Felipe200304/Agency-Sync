package com.agencysync.web.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/** Bloqueio de dia na agenda do modelo (indisponibilidade). */
public record BlockRequest(@NotNull LocalDate date, String title) {}
