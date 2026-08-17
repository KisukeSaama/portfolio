package com.jonathan.portfolio;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.jonathan.portfolio.config.ProjectSeed;
import com.jonathan.portfolio.project.domain.*;
import com.jonathan.portfolio.project.infrastructure.ProjectRepository;
import com.jonathan.portfolio.user.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest @AutoConfigureMockMvc @ActiveProfiles("test") @Testcontainers(disabledWithoutDocker=true)
class PortfolioIntegrationTest {
    @Container @ServiceConnection static PostgreSQLContainer<?> postgres=new PostgreSQLContainer<>("postgres:17-alpine");
    @Autowired MockMvc mvc;@Autowired AdminUserRepository users;@Autowired PasswordEncoder encoder;@Autowired ProjectRepository projects;@Autowired ProjectSeed seed;
    @BeforeEach void admin(){if(users.findByEmailIgnoreCase("admin@example.test").isEmpty())users.save(new AdminUser("admin@example.test",encoder.encode("a-secure-test-password")));}
    @Test void publicEndpointExposesOnlyPublishedVisibleProjects()throws Exception{var draft=new Project(ProjectTestData.request("private-draft"));projects.save(draft);var archived=new Project(ProjectTestData.request("private-archive"));archived.archive();projects.save(archived);mvc.perform(get("/api/v1/public/projects")).andExpect(status().isOk()).andExpect(jsonPath("$[?(@.slug == 'private-draft')]").isEmpty()).andExpect(jsonPath("$[?(@.slug == 'private-archive')]").isEmpty()).andExpect(jsonPath("$[?(@.slug == 'episort')]").exists());}
    @Test void adminEndpointRefusesAnonymousAccess()throws Exception{mvc.perform(get("/api/v1/admin/projects")).andExpect(status().isUnauthorized());}
    @Test void loginRequiresCsrfAndCreatesSession()throws Exception{var json="{\"email\":\"admin@example.test\",\"password\":\"a-secure-test-password\"}";mvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON).content(json)).andExpect(status().isForbidden());mvc.perform(post("/api/v1/auth/login").with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json)).andExpect(status().isOk()).andExpect(jsonPath("$.authenticated").value(true));}
    @Test void adminCanCreatePublishArchiveAndRestore()throws Exception{var json=ProjectTestData.json("integration-project");var created=mvc.perform(post("/api/v1/admin/projects").with(user("admin@example.test").roles("ADMIN")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json)).andExpect(status().isCreated()).andReturn();var id=new com.fasterxml.jackson.databind.ObjectMapper().readTree(created.getResponse().getContentAsString()).get("id").asText();mvc.perform(post("/api/v1/admin/projects/{id}/publish",id).with(user("admin@example.test").roles("ADMIN")).with(csrf())).andExpect(status().isOk()).andExpect(jsonPath("$.publicationStatus").value("PUBLISHED"));mvc.perform(post("/api/v1/admin/projects/{id}/archive",id).with(user("admin@example.test").roles("ADMIN")).with(csrf())).andExpect(status().isOk()).andExpect(jsonPath("$.publicationStatus").value("ARCHIVED"));mvc.perform(post("/api/v1/admin/projects/{id}/restore",id).with(user("admin@example.test").roles("ADMIN")).with(csrf())).andExpect(status().isOk()).andExpect(jsonPath("$.publicationStatus").value("DRAFT"));}
    @Test void duplicateSlugReturnsConflict()throws Exception{var json=ProjectTestData.json("episort");mvc.perform(post("/api/v1/admin/projects").with(user("admin@example.test").roles("ADMIN")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json)).andExpect(status().isConflict());}
    @Test void seedIsIdempotent()throws Exception{long before=projects.count();seed.run(new DefaultApplicationArguments());seed.run(new DefaultApplicationArguments());assertThat(projects.count()).isEqualTo(before);}
}
