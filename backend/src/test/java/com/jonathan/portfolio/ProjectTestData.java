package com.jonathan.portfolio;
import com.jonathan.portfolio.project.domain.*;
import com.jonathan.portfolio.project.dto.ProjectWriteRequest;
import java.util.List;
final class ProjectTestData {
    static ProjectWriteRequest request(String slug){return new ProjectWriteRequest("Integration project",slug,"A short description that is precise enough.","A full description long enough to satisfy every validation rule.","A concrete problem detailed enough for the test.","Project context.","A complete solution with enough detail.","Project design and development.","Modular architecture.",ProjectStatus.IN_PROGRESS,ProjectType.PERSONAL,FeatureLevel.SECONDARY,false,10,Visibility.PRIVATE,List.of("Test"),List.of("Java"),List.of("Create"),List.of("Decide"),List.of("Validate"),List.of("Learn"),List.of("Continue"),"","","SEO title","An SEO description that is clear enough.","");}
    static String json(String slug){return """
      {"title":"Integration project","slug":"%s","shortDescription":"A short description that is precise enough.","fullDescription":"A full description long enough to satisfy every validation rule.","problem":"A concrete problem detailed enough for the test.","context":"Project context.","solution":"A complete solution with enough detail.","role":"Project design and development.","architecture":"Modular architecture.","status":"IN_PROGRESS","projectType":"PERSONAL","featureLevel":"SECONDARY","featured":false,"displayOrder":10,"visibility":"PRIVATE","objectives":["Test"],"technologies":["Java"],"features":["Create"],"decisions":["Decide"],"challenges":["Validate"],"learnings":["Learn"],"nextSteps":["Continue"],"githubUrl":"","demoUrl":"","seoTitle":"SEO title","seoDescription":"An SEO description that is clear enough.","openGraphImageUrl":""}
      """.formatted(slug);}
}
