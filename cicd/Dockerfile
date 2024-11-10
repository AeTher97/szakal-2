FROM openjdk:21
COPY ../backend/build/libs/backend-1.0.0.jar szakal.jar

EXPOSE 8080

CMD ["java", "--enable-preview", "-jar", "./szakal.jar"]