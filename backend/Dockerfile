# ---- Stage 1: Build the jar with Maven ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml first so dependencies are cached unless pom.xml changes
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the rest of the source and build
COPY src ./src
RUN mvn clean package -DskipTests

# ---- Stage 2: Run the jar with a lightweight JRE ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy only the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Render sets PORT dynamically; Spring Boot reads it via server.port=${PORT:8080}
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
