package com.agencysync.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordChangeRequest(
        @NotBlank String currentPassword,
        @NotBlank @Size(min = 6, message = "A nova senha deve ter ao menos 6 caracteres") String newPassword) {}
