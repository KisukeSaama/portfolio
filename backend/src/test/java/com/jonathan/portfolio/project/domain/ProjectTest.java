package com.jonathan.portfolio.project.domain;

import static org.assertj.core.api.Assertions.assertThat;
import com.jonathan.portfolio.project.dto.ProjectWriteRequest;
import java.util.List;
import org.junit.jupiter.api.Test;

class ProjectTest {
    @Test void lifecycleKeepsDraftsAndArchivesPrivate(){var project=new Project(request("cycle-de-vie"));assertThat(project.getPublicationStatus()).isEqualTo(PublicationStatus.DRAFT);assertThat(project.getVisibility()).isEqualTo(Visibility.PRIVATE);project.publish();assertThat(project.getPublicationStatus()).isEqualTo(PublicationStatus.PUBLISHED);assertThat(project.getVisibility()).isEqualTo(Visibility.PUBLIC);project.archive();assertThat(project.getPublicationStatus()).isEqualTo(PublicationStatus.ARCHIVED);assertThat(project.getVisibility()).isEqualTo(Visibility.PRIVATE);project.restore();assertThat(project.getPublicationStatus()).isEqualTo(PublicationStatus.DRAFT);assertThat(project.getArchivedAt()).isNull();}
    static ProjectWriteRequest request(String slug){return new ProjectWriteRequest("Test project",slug,"A short description that is precise enough.","A full description long enough to satisfy every validation rule.","A concrete problem detailed enough for the test.","Project context.","A complete solution with enough detail.","Project design and development.","Modular architecture.",ProjectStatus.IN_PROGRESS,ProjectType.PERSONAL,FeatureLevel.SECONDARY,false,10,Visibility.PRIVATE,List.of("Test"),List.of("Java"),List.of("Create"),List.of("Decide"),List.of("Validate"),List.of("Learn"),List.of("Continue"),"","","SEO title","An SEO description that is clear enough.","");}
}
