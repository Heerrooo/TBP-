# --- Build Stage ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests -B

# --- Production Stage ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy built JAR from build stage
COPY --from=build /app/target/demo-*.jar app.jar

# Expose port 8081
EXPOSE 8081

# Set environment variables
ENV SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/demo_db
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=2300032364
ENV SPRING_JPA_HIBERNATE_DDL_AUTO=update
ENV SPRING_PROFILES_ACTIVE=docker

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=60s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8081/actuator/health || exit 1

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
