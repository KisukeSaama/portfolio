package com.jonathan.portfolio.project.domain;

import static org.assertj.core.api.Assertions.assertThat;
import com.jonathan.portfolio.project.dto.ProjectWriteRequest;
import java.util.List;
import org.junit.jupiter.api.Test;

class ProjectTest {
    @Test void lifecycleKeepsDraftsAndArchivesPrivate(){var project=new Project(request("cycle-de-vie"));assertThat(project.getPublicationStatus()).isEqualTo(PublicationStatus.DRAFT);assertThat(project.getVisibility()).isEqualTo(Visibility.PRIVATE);project.publish();assertThat(project.getPublicationStatus()).isEqualTo(PublicationStatus.PUBLISHED);assertThat(project.getVisibility()).isEqualTo(Visibility.PUBLIC);project.archive();assertThat(project.getPublicationStatus()).isEqualTo(PublicationStatus.ARCHIVED);assertThat(project.getVisibility()).isEqualTo(Visibility.PRIVATE);project.restore();assertThat(project.getPublicationStatus()).isEqualTo(PublicationStatus.DRAFT);assertThat(project.getArchivedAt()).isNull();}
    static ProjectWriteRequest request(String slug){return new ProjectWriteRequest("Projet de test",slug,"Une description courte suffisamment précise.","Une description complète suffisamment longue pour respecter toutes les validations.","Un problème concret suffisamment détaillé pour le test.","Contexte du projet.","Une solution complète suffisamment détaillée.","Conception et développement du projet.","Architecture modulaire.",ProjectStatus.IN_PROGRESS,ProjectType.PERSONAL,FeatureLevel.SECONDARY,false,10,Visibility.PRIVATE,List.of("Tester"),List.of("Java"),List.of("Créer"),List.of("Décider"),List.of("Valider"),List.of("Apprendre"),List.of("Continuer"),"","","Titre SEO","Une description SEO suffisamment claire.","");}
}
