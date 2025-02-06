# Use an official Maven image to build the project
FROM maven:3.8.7-eclipse-temurin-17 AS build

# Set working directory inside the container
WORKDIR /app

# Copy project files to the container
COPY . .

# Build the application (creates the .jar file)
RUN mvn clean package -DskipTests

# Use a lightweight JDK image to run the application
FROM eclipse-temurin:17-jdk

# Set working directory for the runtime container
WORKDIR /app

# Copy the built JAR file from the previous build stage
COPY --from=build /app/target/springboot-jwt-auth-0.0.1-SNAPSHOT.jar app.jar

# Expose the port (Ensure this matches your application.properties config)
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
