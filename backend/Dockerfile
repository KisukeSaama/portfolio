FROM eclipse-temurin:25-jdk-alpine AS build
WORKDIR /workspace
COPY gradlew gradlew.bat settings.gradle build.gradle ./
COPY gradle ./gradle
RUN chmod +x gradlew
COPY src ./src
RUN ./gradlew clean bootJar --no-daemon

FROM eclipse-temurin:25-jre-alpine AS runtime
WORKDIR /app
# The UID is pinned because the deployed media directory is a host bind mount: the CI chowns it
# to this exact id so the read-only container can still write uploads into it.
RUN addgroup -S -g 10001 portfolio && adduser -S -u 10001 portfolio -G portfolio
COPY --from=build --chown=portfolio:portfolio /workspace/build/libs/*.jar app.jar
USER portfolio
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "/app/app.jar"]
