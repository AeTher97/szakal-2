FROM ubuntu:24.04 AS basebuilder

RUN apt-get update \
&& apt-get -y install dos2unix nodejs npm openjdk-21-jdk

FROM basebuilder AS codebuilder
COPY . /src
WORKDIR /src

RUN dos2unix gradlew \
&& dos2unix build-and-copy.sh \
&& ./build-and-copy.sh \
&& ./gradlew build

FROM openjdk:21
COPY --from=codebuilder /src/backend/build/libs/backend-1.0.0.jar  szakal.jar

EXPOSE 8080

CMD ["java", "--enable-preview", "-jar", "./szakal.jar"]