# Java: Code Example for Apache Kafka

- java 1.8+
- maven 


## Configuration 


fetch your kafka cluster config and update [java.config](java.config) file


## Compile project 

```
mvn clean package
```


## Produce Records 

```
mvn exec:java -Dexec.mainClass="io.confluent.examples.clients.cloud.ProducerExample" \
-Dexec.args="java.config test1"
```

[producer code](src/main/java/io/confluent/examples/clients/cloud/ProducerExample.java)


## Consume Records

```
mvn exec:java -Dexec.mainClass="io.confluent.examples.clients.cloud.ConsumerExample" \
-Dexec.args="java.config test1"
```

[consumer code](src/main/java/io/confluent/examples/clients/cloud/ConsumerExample.java)


## Kafka Streams

```
mvn exec:java -Dexec.mainClass="io.confluent.examples.clients.cloud.StreamsExample" \
-Dexec.args="java.config test1"
```

[Kafka Streams code](src/main/java/io/confluent/examples/clients/cloud/StreamsExample.java)


## Avro and Confluent Cloud Schema Registry

check your configuration :

```
curl -u {{ SR_API_KEY }}:{{ SR_API_SECRET }} https://{{ SR_ENDPOINT }}/subjects
```

### Produce Avro Records

```
mvn exec:java -Dexec.mainClass="io.confluent.examples.clients.cloud.ProducerAvroExample" \
-Dexec.args="java.config test2"
```

[producer Avro code](src/main/java/io/confluent/examples/clients/cloud/ProducerAvroExample.java)

### Consume Avro Records

```
mvn exec:java -Dexec.mainClass="io.confluent.examples.clients.cloud.ConsumerAvroExample" \
-Dexec.args="java.config test2"
```

[consumer Avro code](src/main/java/io/confluent/examples/clients/cloud/ConsumerAvroExample.java)

### Avro Kafka Streams

```
mvn exec:java -Dexec.mainClass="io.confluent.examples.clients.cloud.StreamsAvroExample" \
-Dexec.args="java.config test2"
```

[Kafka Streams Avro code](src/main/java/io/confluent/examples/clients/cloud/StreamsAvroExample.java)

## Schema Evolution with Confluent Cloud Schema Registry

```
curl -u <SR API KEY>:<SR API SECRET> https://<SR ENDPOINT>/subjects
```

View the schema information for subject test2-value.

```
curl -u <SR API KEY>:<SR API SECRET> https://<SR ENDPOINT>/subjects/test2-value/versions/1
```

Verify the schema information for subject test2-value

```
{"subject":"test2-value","version":1,"id":100001,"schema":"{\"name\":\"io.confluent.examples.clients.cloud.DataRecordAvro\",\"type\":\"record\",\"fields\":[{\"name\":\"count\",\"type\":\"long\"}]}"}
```

For schema evolution, you can test schema compatibility between newer schema versions and older schema versions in Confluent Cloud Schema Registry. The pom.xml hardcodes the Schema Registry subject name to test2-value—change this if you didn’t use topic name test2. Then test local schema compatibility for DataRecordAvro2a.avsc, which should fail, and DataRecordAvro2b.avsc, which should pass.
```
# DataRecordAvro2a.avsc compatibility test: FAIL
mvn schema-registry:test-compatibility "-DschemaRegistryUrl={{ SCHEMA_REGISTRY_URL }}" "-DschemaRegistryBasicAuthUserInfo={{ SR_API_KEY }}:{{ SR_API_SECRET }}" "-DschemaLocal=src/main/resources/avro/io/confluent/examples/clients/cloud/DataRecordAvro2a.avsc"

# DataRecordAvro2b.avsc compatibility test: PASS
mvn schema-registry:test-compatibility "-DschemaRegistryUrl={{ SCHEMA_REGISTRY_URL }}" "-DschemaRegistryBasicAuthUserInfo={{ SR_API_KEY }}:{{ SR_API_SECRET }}" "-DschemaLocal=src/main/resources/avro/io/confluent/examples/clients/cloud/DataRecordAvro2b.avsc"
```



