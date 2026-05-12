FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /build

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy

RUN addgroup --system springgroup && adduser --system --ingroup springgroup springuser

WORKDIR /app

COPY --from=builder /build/target/*.jar app.jar

RUN chown springuser:springgroup app.jar

USER springuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]