package com.agencysync.repo;

import com.agencysync.domain.Invite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface InviteRepo extends JpaRepository<Invite, UUID> {
    Optional<Invite> findByToken(String token);
}
