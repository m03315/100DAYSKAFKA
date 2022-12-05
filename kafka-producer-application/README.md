# JAVA


## Create Cluster Config Information file

rename [ccloud-template.properties](configuration/ccloud-template.properties) file to ccloud.properties in configuration directory

replace below values with yours:

- {{ CLUSTER_API_KEY }}
- {{ CLUSTER_API_SECRET }}
- {{ SR_URL }}
- {{ SR_API_KEY }}
- {{ SR_API_SECRET }}


## Create a new topic 

create a new topic named "output-topic"


## Configure a gradle java project

### Create a gradle build file 

add a new gradle build file named [build.gradle](build.gradle)


Then run this command to obtain the Gradle wrapper
```
gradle wrapper
```

### Create new development config file 

rename [dev-template.properties](configuration/dev-template.properties) to dev.properties


key.serializer - The serializer the KafkaProducer will use to serialize the key.

value.serializer - The serializer the KafkaProducer will use to serialize the value.

acks - The KafkaProducer uses the acks configuration to tell the lead broker how many acknowledgments to wait for to consider a produce request complete. Acceptable values for acks are: 0, 1 (the default), -1, or all. Setting acks to -1 is the same as setting it to all.

acks=0: "fire and forget", once the producer sends the record batch it is considered successful

acks=1: leader broker added the records to its local log but didn’t wait for any acknowledgment from the followers

acks=all: highest data durability guarantee, the leader broker persisted the record to its log and received acknowledgment of replication from all in-sync replicas. When using acks=all, it’s strongly recommended to update min.insync.replicas as well.



### Update the properties file

append ccloud.properties file's configuration informations to dev.properties file

```
cat configuration/ccloud.properties >> configuration/dev.properties

```

### create the java kafka producer application

```
mkdir -p src/main/java/io/confluent/developer

```

a new java class file [KafkaProducerApplication.java](src/main/java/io/confluent/developer/KafkaProducerApplication.java)


### create data to produce to Kafka

create a [input.txt](input.txt) file



### compile and run this application 

```
./gradlew shadowJar
```

```
java -jar build/libs/kafka-producer-application-standalone-0.0.1.jar configuration/dev.properties input.txt
```

### Create a test configuration file

add a file named [test.properties](configuration/test.properties)

### write a unit test 

```
mkdir -p src/test/java/io/confluent/developer

```

add a new test java class file [KafkaProducerApplicationTest.java](src/test/java/io/confluent/developer/KafkaProducerApplicationTest.java)

>The KafkaProducer.send method is asynchronous and returns as soon as the provided record is placed in the buffer of records to be sent to the broker. Once the broker acknowledges that the record has been appended to its log, the broker completes the produce request, which the application receives as RecordMetadata—information about the committed message. This tutorial prints the timestamp and offset for each record sent using the RecordMetadata object. Note that calling Future.get() for any record will block until the produce request completes.


### Run the test 

```
./gradlew test
```

## Test it with production 

rename this file [prod-template.properties](configuration/prod-template.properties) to prod.properties


### Build a docker image

```
gradle jibDockerBuild --image=io.confluent.developer/kafka-producer-application-join:0.0.1

```

### Launch a container 

```
docker run -v $PWD/configuration/prod.properties:/config.properties io.confluent.developer/kafka-producer-application-join:0.0.1 config.properties
```







