package com.jonathan.portfolio;
import com.jonathan.portfolio.project.domain.*;
import com.jonathan.portfolio.project.dto.ProjectWriteRequest;
import java.util.List;
final class ProjectTestData {
    static ProjectWriteRequest request(String slug){return new ProjectWriteRequest("Projet intégration",slug,"Une description courte suffisamment précise.","Une description complète suffisamment longue pour respecter toutes les validations.","Un problème concret suffisamment détaillé pour le test.","Contexte du projet.","Une solution complète suffisamment détaillée.","Conception et développement du projet.","Architecture modulaire.",ProjectStatus.IN_PROGRESS,ProjectType.PERSONAL,FeatureLevel.SECONDARY,false,10,Visibility.PRIVATE,List.of("Tester"),List.of("Java"),List.of("Créer"),List.of("Décider"),List.of("Valider"),List.of("Apprendre"),List.of("Continuer"),"","","Titre SEO","Une description SEO suffisamment claire.","");}
    static String json(String slug){return """
      {"title":"Projet intégration","slug":"%s","shortDescription":"Une description courte suffisamment précise.","fullDescription":"Une description complète suffisamment longue pour respecter toutes les validations.","problem":"Un problème concret suffisamment détaillé pour le test.","context":"Contexte du projet.","solution":"Une solution complète suffisamment détaillée.","role":"Conception et développement du projet.","architecture":"Architecture modulaire.","status":"IN_PROGRESS","projectType":"PERSONAL","featureLevel":"SECONDARY","featured":false,"displayOrder":10,"visibility":"PRIVATE","objectives":["Tester"],"technologies":["Java"],"features":["Créer"],"decisions":["Décider"],"challenges":["Valider"],"learnings":["Apprendre"],"nextSteps":["Continuer"],"githubUrl":"","demoUrl":"","seoTitle":"Titre SEO","seoDescription":"Une description SEO suffisamment claire.","openGraphImageUrl":""}
      """.formatted(slug);}
}
