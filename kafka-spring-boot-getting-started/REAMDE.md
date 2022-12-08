# Apache Kafka and Spring Boot


## Requirements

- Gradle
- Java 11


## Create a gradle project 

create a new Gradle build file [build.gradle](build.gradle)


## Create configuration 

Rename the file [application-template.yaml](src/main/resources/application-template.yaml) to application.yaml


replace below values with yours :

-  bootstrap-servers

- {{ CLUSTER API KEY }}

- {{ CLUSTER API SECRET }}



## create Topic 


Use existing topic named purchase, if not exist create it


## Write a Springboot producer application 

wreate a new java class file using SpringBootApplication annotation [SpringBootWithKafkaApplication.java](src/main/java/examples/SpringBootWithKafkaApplication.java)

create a Kafka producer class [Producer.java](src/main/java/examples/Producer.java)



## write a consumer application

create a new java class for kafka consumer [Consumer.java](src/main/java/examples/Consumer.java)


## Build & compile project

```
gradle build
```

## Produce Events 

```
gradle bootRun --args='--producer'
```

## Consume Events 

```
gradle bootRun --args='--consumer'
```

