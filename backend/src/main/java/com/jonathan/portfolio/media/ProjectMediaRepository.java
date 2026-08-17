package com.jonathan.portfolio.media;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProjectMediaRepository extends JpaRepository<ProjectMedia, UUID> {
    @Query("select m from ProjectMedia m join fetch m.project p where m.id=:id and p.publicationStatus='PUBLISHED' and p.visibility='PUBLIC' and p.archivedAt is null")
    Optional<ProjectMedia> findPublicById(UUID id);
}
