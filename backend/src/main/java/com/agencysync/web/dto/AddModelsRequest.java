package com.agencysync.web.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;
import java.util.UUID;

public record AddModelsRequest(@NotEmpty List<UUID> modelIds) {}
