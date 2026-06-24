package com.agencysync.repo;

import com.agencysync.domain.AppUser;
import com.agencysync.domain.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AppUserRepo extends JpaRepository<AppUser, UUID> {
    Optional<AppUser> findByEmail(String email);
    List<AppUser> findByRole(UserRole role);
    Optional<AppUser> findByModelId(UUID modelId);
}
