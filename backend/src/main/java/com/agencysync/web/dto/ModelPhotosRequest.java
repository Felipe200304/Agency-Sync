package com.agencysync.web.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

/** Adiciona uma ou várias fotos de uma vez (data URLs já comprimidos). */
public record ModelPhotosRequest(@NotEmpty List<String> urls) {
}
