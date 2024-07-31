# use openjdk 17
FROM openjdk:17

# copy the jar file to the container
COPY app.jar /app.jar

# Set the working directory to /app
WORKDIR /app

# run the jar file
CMD ["java","-jar","/app.jar"]
