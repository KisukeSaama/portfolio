package com.jonathan.portfolio.config;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.*;
@Configuration public class OpenApiConfig {@Bean OpenAPI portfolioOpenApi(){return new OpenAPI().info(new Info().title("Jonathan Blanchard Portfolio API").version("v1").description("API publique et administration sécurisée du portfolio."));}}
