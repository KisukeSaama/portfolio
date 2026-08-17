package com.jonathan.portfolio.project.domain;

import static org.assertj.core.api.Assertions.assertThat;
import com.jonathan.portfolio.project.dto.ProjectResponse;
import com.jonathan.portfolio.project.dto.ProjectWriteRequest;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

class ProjectTest {
    @Test void lifecycleKeepsDraftsAndArchivesPrivate(){var project=new Project(request("cycle-de-vie"));assertThat(project.getPublicationStatus()).isEqualTo(PublicationStatus.DRAFT);assertThat(project.getVisibility()).isEqualTo(Visibility.PRIVATE);project.publish();assertThat(project.getPublicationStatus()).isEqualTo(PublicationStatus.PUBLISHED);assertThat(project.getVisibility()).isEqualTo(Visibility.PUBLIC);project.archive();assertThat(project.getPublicationStatus()).isEqualTo(PublicationStatus.ARCHIVED);assertThat(project.getVisibility()).isEqualTo(Visibility.PRIVATE);project.restore();assertThat(project.getPublicationStatus()).isEqualTo(PublicationStatus.DRAFT);assertThat(project.getArchivedAt()).isNull();}
    @Test void frenchOverlaysOnlyTheFieldsItFills(){
        var translated=new ProjectTranslation("Projet de test",null,null,null,null,null,null,null,List.of("Objectif"),null,null,null,null,null,null,null);
        var project=new Project(withTranslations("overlay",Map.of("fr",translated)));
        var fr=ProjectResponse.from(project,"fr");
        assertThat(fr.title()).isEqualTo("Projet de test");
        assertThat(fr.objectives()).containsExactly("Objectif");
        // Untranslated fields fall back rather than rendering an empty heading.
        assertThat(fr.solution()).isEqualTo("A complete solution with enough detail.");
        assertThat(fr.technologies()).containsExactly("Java");
        // The slug is an address, so it never varies by locale.
        assertThat(fr.slug()).isEqualTo("overlay");
    }
    @Test void anUnknownOrAbsentLocaleReadsTheSourceLanguage(){
        var project=new Project(withTranslations("source",Map.of("fr",new ProjectTranslation("Projet de test",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null))));
        assertThat(ProjectResponse.from(project,"de").title()).isEqualTo("Test project");
        assertThat(ProjectResponse.from(project,null).title()).isEqualTo("Test project");
    }
    @Test void aBlankTranslationIsNotATranslation(){
        var project=new Project(withTranslations("blank",Map.of("fr",new ProjectTranslation("   ",null,null,null,null,null,null,null,List.of(),null,null,null,null,null,null,null))));
        var fr=ProjectResponse.from(project,"fr");
        assertThat(fr.title()).isEqualTo("Test project");
        assertThat(fr.objectives()).containsExactly("Test");
    }
    @Test void aLocaleKeyIsStoredFolded(){
        var project=new Project(withTranslations("folded",Map.of("FR",new ProjectTranslation("Projet de test",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null))));
        assertThat(project.getTranslations()).containsOnlyKeys("fr");
        assertThat(ProjectResponse.from(project,"FR").title()).isEqualTo("Projet de test");
    }
    @Test void backfillNeverOverwritesATranslationThatIsAlreadyThere(){
        var mine=new ProjectTranslation("Titre saisi à la main",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
        var project=new Project(withTranslations("backfill",Map.of("fr",mine)));
        var seeded=new ProjectTranslation("Titre du seed",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
        assertThat(project.addTranslationsIfAbsent(Map.of("fr",seeded))).isFalse();
        assertThat(ProjectResponse.from(project,"fr").title()).isEqualTo("Titre saisi à la main");
        // A locale that is genuinely missing is filled in.
        assertThat(project.addTranslationsIfAbsent(Map.of("es",seeded))).isTrue();
        assertThat(project.getTranslations()).containsOnlyKeys("fr","es");
    }
    private static ProjectWriteRequest withTranslations(String slug,Map<String,ProjectTranslation> translations){
        var base=request(slug);
        return new ProjectWriteRequest(base.title(),base.slug(),base.shortDescription(),base.fullDescription(),base.problem(),base.context(),base.solution(),base.role(),base.architecture(),base.status(),base.projectType(),base.featureLevel(),base.featured(),base.displayOrder(),base.visibility(),base.objectives(),base.technologies(),base.features(),base.decisions(),base.challenges(),base.learnings(),base.nextSteps(),base.githubUrl(),base.demoUrl(),base.seoTitle(),base.seoDescription(),base.openGraphImageUrl(),translations);
    }
    static ProjectWriteRequest request(String slug){return new ProjectWriteRequest("Test project",slug,"A short description that is precise enough.","A full description long enough to satisfy every validation rule.","A concrete problem detailed enough for the test.","Project context.","A complete solution with enough detail.","Project design and development.","Modular architecture.",ProjectStatus.IN_PROGRESS,ProjectType.PERSONAL,FeatureLevel.SECONDARY,false,10,Visibility.PRIVATE,List.of("Test"),List.of("Java"),List.of("Create"),List.of("Decide"),List.of("Validate"),List.of("Learn"),List.of("Continue"),"","","SEO title","An SEO description that is clear enough.","",java.util.Map.of());}
}
