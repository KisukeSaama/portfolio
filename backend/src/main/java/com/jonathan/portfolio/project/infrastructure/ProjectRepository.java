package com.jonathan.portfolio.project.infrastructure;

import com.jonathan.portfolio.project.domain.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProjectRepository extends JpaRepository<Project, UUID>, JpaSpecificationExecutor<Project> {
    boolean existsBySlugIgnoreCase(String slug);
    boolean existsBySlugIgnoreCaseAndIdNot(String slug, UUID id);
    List<Project> findAllByPublicationStatusAndVisibilityAndArchivedAtIsNullOrderByDisplayOrderAscUpdatedAtDesc(PublicationStatus publicationStatus, Visibility visibility);
    Optional<Project> findBySlugAndPublicationStatusAndVisibilityAndArchivedAtIsNull(String slug, PublicationStatus publicationStatus, Visibility visibility);
    List<Project> findByTitleContainingIgnoreCaseOrderByDisplayOrderAsc(String query, Pageable pageable);
    long countByPublicationStatus(PublicationStatus status);
}
