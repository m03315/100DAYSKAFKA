# Initialise an Apache Kafka quick start enivrement

## Docker-Compose

### Set up a kafka broker with [docker-compose.yml](docker-compose.yml)

1. start a kafka broker

```
docker-compose up -d
```

2. create a topic

It’s good practice to explicitly create them before using them, even if Kafka is configured to automagically create them when referenced.

```
docker exec broker \
kafka-topics --bootstrap-server broker:9092 \
--create \
--topic quickstart
```

3. write messages to the topic

```
docker exec broker \
kafka-topics --bootstrap-server broker:9092 \
--create \
--topic quickstart
```

4. Read messages from the topic

```
docker exec --interactive --tty broker \
kafka-console-consumer --bootstrap-server broker:9092 \
--topic quickstart \
--from-beginning
```

5. Stop the kafka broker

```
docker-compose down
```

> https://developer.confluent.io/quickstart/kafka-docker/

## Confluent cloud

1. Build docker image from [Dockerfile](Dockerfile)
```
docker build -t confluent-cli:latest .
```

2. Run a confluent cli container
```
docker run -it confluent-cli:latest sh
```

if you have no confluent cloud account, use cloud-signup command to create a new one, otherwise you could use directly login command

```
confluent cloud-signup
```

```
confluent login
```


3. Create a Kafka cluster


- provider: aws, azure, gcp
- region: cloud provider region

get availables values :

```
confluent kafka region list --cloud <provider>
```

```
confluent kafka cluster create quickstart --cloud <provider> --region <region>
```
Example:
```
confluent kafka cluster create quickstart --cloud aws --region us-east-1
confluent kafka cluster create quickstart --cloud azure --region eastus
confluent kafka cluster create quickstart --cloud gcp --region us-east1
```

4. Wait for cluster to be running
```
confluent kafka cluster list
```
Example :
```
confluent kafka cluster list
Id      |    Name    | Type  | Provider |   Region    | Availability | Status
---------------+------------+-------+----------+-------------+--------------+---------
lkc-123456 | quickstart | BASIC | gcp      | us-east1    | single-zone  | UP
```


5. Set active cluster

set a default cluster, no need to specify it

```
confluent kafka cluster use <cluster ID>
```

Example:
```
confluent kafka cluster use lkc-123456
Set Kafka cluster "lkc-123456" as the active cluster for environment "env-123456".
```

6. Create a topic

Create a topic named *quickstart* that has 1 *partition* :

```
confluent kafka topic create quickstart --partitions 1
```

7. Create an API key

API key will be used to produce and consume messages:

```
confluent api-key create --resource <cluster ID>
```

Set Active API key  :
```
confluent api-key use <API key> --resource <cluster ID>
```

8. Produce a message to the topic

Produce a message to the quickstart topic:
```
confluent kafka topic produce quickstart
```

enter Ctrl-C or Ctrl-D to exit:
```
Starting Kafka Producer. Use Ctrl-C or Ctrl-D to exit.
hello world
^C
```

9. Consume the message from the topic

```
confluent kafka topic consume quickstart --from-beginning
```

> https://developer.confluent.io/quickstart/kafka-on-confluent-cloud/

## Local enivrement

Install Apache Kafka

1. get install package
```
wget https://packages.confluent.io/archive/7.0/confluent-community-7.0.1.tar.gz
```

2. unzip the file :
```
tar -xf confluent-community-7.0.1.tar.gz
```

```
cd confluent-7.0.1
```

3. Start the Kafka broker

lauch the broker in KRaft mode, which means that it runs without ZooKeeper.

Configure the storage :
```
./bin/kafka-storage format \
--config ./etc/kafka/kraft/server.properties \
--cluster-id $(./bin/kafka-storage random-uuid)
```
```
./bin/kafka-server-start ./etc/kafka/kraft/server.properties
```
4. Create a topic
```
./bin/kafka-topics --bootstrap-server localhost:9092 \
--create \
--topic quickstart
```
5. Write messages to the topic

```
./bin/kafka-console-producer --bootstrap-server localhost:9092 \
--topic quickstart
```

6. Read messages from the topic

```
./bin/kafka-console-consumer --bootstrap-server localhost:9092 \
--topic quickstart \
--from-beginning
```

7. Write some more messages

```
./bin/kafka-console-producer --bootstrap-server localhost:9092 \
--topic quickstart
```
8. Stop the kafka broker

Press Ctrl-C in the terminal

> https://developer.confluent.io/quickstart/kafka-local/

