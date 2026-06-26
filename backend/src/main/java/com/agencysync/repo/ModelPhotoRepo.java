package com.agencysync.repo;

import com.agencysync.domain.ModelPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public interface ModelPhotoRepo extends JpaRepository<ModelPhoto, UUID> {

    List<ModelPhoto> findByModelIdOrderByPositionAsc(UUID modelId);

    /** Próxima posição livre (galeria sempre cresce no fim). */
    long countByModelId(UUID modelId);

    @Transactional
    long deleteByIdAndModelId(UUID id, UUID modelId);
}
