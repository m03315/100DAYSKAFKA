# Java Spring Boot: Code Example for Apache Kafka

- Java 1.8 or higher to run the demo application.


## setup config file

create $HOME/java.config

```
# Required connection configs for Kafka producer, consumer, and admin
bootstrap.servers={{ BROKER_ENDPOINT }}
security.protocol=SASL_SSL
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='{{ CLUSTER_API_KEY }}' password='{{ CLUSTER_API_SECRET }}';
sasl.mechanism=PLAIN
# Required for correctness in Apache Kafka clients prior to 2.6
client.dns.lookup=use_all_dns_ips

# Best practice for higher availability in Apache Kafka clients prior to 3.0
session.timeout.ms=45000

# Best practice for Kafka producer to prevent data loss 
acks=all

# Required connection configs for Confluent Cloud Schema Registry
schema.registry.url=https://{{ SR_ENDPOINT }}
basic.auth.credentials.source=USER_INFO
basic.auth.user.info={{ SR_API_KEY }}:{{ SR_API_SECRET }}
```

## Avro and Confluent Cloud Schema Registry

If the topic does not already exist in your Kafka cluster, the producer application will use the Kafka Admin Client API to create the topic. Each record written to Kafka has a key representing a username and a value of a count, formatted as json (for example, {"count": 0}). The consumer application reads the same Kafka topic and keeps a rolling sum of the count as it processes each record.

### Check your config

```
curl -u {{ SR_API_KEY }}:{{ SR_API_SECRET }} https://{{ SR_ENDPOINT }}/subjects
```

## Produce and Consume Records

This Spring Boot application has the following two components: [Producer](src/main/java/io/confluent/examples/clients/cloud/springboot/kafka/ProducerExample.java) and [Consumer](src/main/java/io/confluent/examples/clients/cloud/springboot/kafka/ConsumerExample.java) that are initialized during the Spring Boot application startup. The producer writes Kafka data to a topic in your Kafka cluster. Each record has a String key representing a username (for example, alice) and a value of a count, formatted with the Avro schema [DataRecordAvro.avsc](src/main/avro/DataRecordAvro.avsc)

### Run the producer and consumer with the following command
```
./startProducerConsumer.sh
```

### Stop

press CTRL-C

## Kafka Streams
The Kafka Streams API reads from the same topic and does a rolling count and stateful sum aggregation as it processes each record.

### Run the Kafka Streams application

```
./startStreams.sh
```

### Stop

press CTRL-C

### [Kafka Streams Code](src/main/java/io/confluent/examples/clients/cloud/springboot/streams/SpringbootStreamsApplication.java)


