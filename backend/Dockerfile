# ============================================
# BUILD STAGE
# ============================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# ============================================
# PRODUCTION STAGE
# ============================================
FROM eclipse-temurin:21-jre-alpine

# Set working directory
WORKDIR /app

# Install required packages
RUN apk add --no-cache tzdata curl

# Set timezone
ENV TZ=UTC

# Copy jar file from build stage
COPY --from=build /app/target/ai-exam-platform.jar app.jar

# Create logs directory
RUN mkdir -p /var/log/aiexam && \
    chown -R 1000:1000 /var/log/aiexam

# Create user for running the application
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

# Switch to app user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/api/actuator/health || exit 1

# Environment variables
ENV JAVA_OPTS="\
    -Xmx512m \
    -Xms256m \
    -XX:+UseG1GC \
    -XX:+UseContainerSupport \
    -Djava.security.egd=file:/dev/./urandom \
    -Duser.timezone=UTC"

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]