# JAVA Kafka Producer Application with callbacks


## Configure the project 

configure the project with Gradle build file [build.gradle](build.gradle)



Run following command to obtain Gradle Wrapper:

```
gradle wrapper
```

## Add Confluent Cluster configs informations

add new file [ccloud.properties](configuration/ccloud.properties)

## Add application and producer properties

rename [dev-template.properties](configuration/dev-template.properties)  to dev.properties


## Update dev properties file with confluent cloud configs 

```
cat configuration/ccloud.properties >> configuration/dev.properties

```

## Create the KafkaProducer application

create a new java class [KafkaProducerCallbackApplication.java](src/main/java/io/confluent/developer/KafkaProducerCallbackApplication.java)

## Create data to produce to Kafka

create a file [input.txt](input.txt)

## Compile and run the KafkaProducer application 

in the terminal, run 

```
./gradlew shadowJar
```

run application:

```
java -jar build/libs/kafka-producer-application-callback-standalone-0.0.1.jar configuration/dev.properties input.txt
```

## Create a test configuration file 

create a test file [test.properties](configuration/test.properties)

## Write a unit test 

create new java test class file [KafkaProducerCallbackApplicationTest.java](src/test/java/io/confluent/developer/KafkaProducerCallbackApplicationTest.java)

## Invoke the tests

```
./gradlew test
```

## Create a producation configuration file 

create a production config file [prod.properties](configuration/prod.properties)

## Build a Docker image 

```
gradle jibDockerBuild --image=io.confluent.developer/kafka-producer-application-callback-join:0.0.1
```

## Launch a container 

```
docker run -v $PWD/configuration/prod.properties:/config.properties io.confluent.developer/kafka-producer-application-callback-join:0.0.1 config.properties
```
