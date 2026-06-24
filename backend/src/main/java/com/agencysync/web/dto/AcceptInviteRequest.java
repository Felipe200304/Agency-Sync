package com.agencysync.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AcceptInviteRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6, message = "A senha deve ter ao menos 6 caracteres") String password) {}
