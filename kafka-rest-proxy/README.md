# REST Proxy: Example for Apache Kafka


Generate a file of ENV variables used by Docker to set the bootstrap servers and security configuration.

```
./ccloud-generate-cp-configs.sh java.config
```

Source the generated file of ENV variables.
```
source ./delta_configs/env.delta
```


Get the cp-all-in-one-cloud docker-compose.yml file, which runs Confluent Platform in containers in your local host, and automatically configures them to connect to Confluent Cloud.
```
curl -sS -o docker-compose.yml https://raw.githubusercontent.com/confluentinc/cp-all-in-one/7.3.1-post/cp-all-in-one-cloud/docker-compose.yml
```

## Basic Producer and Consumer

### Produce Records

comment out the following lines in the docker-compose.yml file
```
#KAFKA_REST_SCHEMA_REGISTRY_URL: $SCHEMA_REGISTRY_URL
#KAFKA_REST_CLIENT_BASIC_AUTH_CREDENTIALS_SOURCE: $BASIC_AUTH_CREDENTIALS_SOURCE
#KAFKA_REST_CLIENT_SCHEMA_REGISTRY_BASIC_AUTH_USER_INFO: $SCHEMA_REGISTRY_BASIC_AUTH_USER_INFO
```

Start the REST Proxy Docker container by running the following command

```
docker compose up -d rest-proxy
```

View the REST Proxy logs and wait till you see the log message Server started, listening for requests to confirm it has started.

```
docker compose logs -f rest-proxy
```

```
# List clusters (API v3)
KAFKA_CLUSTER_ID=$(docker compose exec rest-proxy curl -X GET \
     "http://localhost:8082/v3/clusters/" | jq -r ".data[0].cluster_id")

# Create topic (API v3)
docker compose exec rest-proxy curl -X POST \
     -H "Content-Type: application/json" \
     -d "{\"topic_name\":\"test1\",\"partitions_count\":6,\"configs\":[]}" \
     "http://localhost:8082/v3/clusters/${KAFKA_CLUSTER_ID}/topics" | jq .

# Produce 3 messages using JSON (API v2)
docker compose exec rest-proxy curl -X POST \
     -H "Content-Type: application/vnd.kafka.json.v2+json" \
     -H "Accept: application/vnd.kafka.v2+json" \
     --data '{"records":[{"key":"alice","value":{"count":0}},{"key":"alice","value":{"count":1}},{"key":"alice","value":{"count":2}}]}' \
     "http://localhost:8082/topics/test1" | jq .
```


### Consume Records


```
# Create a consumer for JSON data, starting at the beginning of the topic's log
docker compose exec rest-proxy curl -X POST \
     -H "Content-Type: application/vnd.kafka.v2+json" \
     --data '{"name": "ci1", "format": "json", "auto.offset.reset": "earliest"}' \
     http://localhost:8082/consumers/cg1 | jq .

# Subscribe to a topic
docker compose exec rest-proxy curl -X POST \
     -H "Content-Type: application/vnd.kafka.v2+json" \
     --data '{"topics":["test1"]}' \
     http://localhost:8082/consumers/cg1/instances/ci1/subscription | jq .

# Consume some data using the base URL in the first response.
# Note: Issue this command twice due to https://github.com/confluentinc/kafka-rest/issues/432
docker compose exec rest-proxy curl -X GET \
     -H "Accept: application/vnd.kafka.json.v2+json" \
     http://localhost:8082/consumers/cg1/instances/ci1/records | jq .

sleep 10

docker compose exec rest-proxy curl -X GET \
     -H "Accept: application/vnd.kafka.json.v2+json" \
     http://localhost:8082/consumers/cg1/instances/ci1/records | jq .

# Close the consumer with a DELETE to make it leave the group and clean up its resources
docker compose exec rest-proxy curl -X DELETE \
     -H "Content-Type: application/vnd.kafka.v2+json" \
     http://localhost:8082/consumers/cg1/instances/ci1 | jq .
```


### Stop REST Proxy

```
docker compose down
```

## Avro and Confluent Cloud Schema Registry

### Produce Avro Records


uncomment the following lines in the docker-compose.yml file
```
KAFKA_REST_SCHEMA_REGISTRY_URL: $SCHEMA_REGISTRY_URL
KAFKA_REST_CLIENT_BASIC_AUTH_CREDENTIALS_SOURCE: $BASIC_AUTH_CREDENTIALS_SOURCE
KAFKA_REST_CLIENT_SCHEMA_REGISTRY_BASIC_AUTH_USER_INFO: $SCHEMA_REGISTRY_BASIC_AUTH_USER_INFO
```

Start the REST Proxy Docker container by running the following command:
```
docker compose up -d rest-proxy
```

View the REST Proxy logs and wait till you see the log message Server started, listening for requests to confirm it has started.
```
docker compose logs -f rest-proxy
```

Get the Kafka cluster ID that the REST Proxy is connected to.
```
KAFKA_CLUSTER_ID=$(docker compose exec rest-proxy curl -X GET \
     "http://localhost:8082/v3/clusters/" | jq -r ".data[0].cluster_id")
```

```
# List clusters (API v3)
KAFKA_CLUSTER_ID=$(docker compose exec rest-proxy curl -X GET \
     "http://localhost:8082/v3/clusters/" | jq -r ".data[0].cluster_id")

# Create topic (API v3)
docker compose exec rest-proxy curl -X POST \
     -H "Content-Type: application/json" \
     -d "{\"topic_name\":\"test2\",\"partitions_count\":6,\"configs\":[]}" \
     "http://localhost:8082/v3/clusters/${KAFKA_CLUSTER_ID}/topics" | jq .

# Register a new Avro schema for topic test2
docker compose exec rest-proxy curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{ "schema": "[ { \"type\":\"record\", \"name\":\"countInfo\", \"fields\": [ {\"name\":\"count\",\"type\":\"long\"}]} ]" }' -u "$SCHEMA_REGISTRY_BASIC_AUTH_USER_INFO" "$SCHEMA_REGISTRY_URL/subjects/test2-value/versions"

# Get the Avro schema id
schemaid=$(docker compose exec rest-proxy curl -X GET -u "$SCHEMA_REGISTRY_BASIC_AUTH_USER_INFO" "$SCHEMA_REGISTRY_URL/subjects/test2-value/versions/latest" | jq '.id')

# Produce an Avro message (API v2)
docker compose exec rest-proxy curl -X POST \
     -H "Content-Type: application/vnd.kafka.avro.v2+json" \
     -H "Accept: application/vnd.kafka.v2+json" \
     --data '{"value_schema_id": '"$schemaid"', "records": [{"value": {"countInfo":{"count": 0}}},{"value": {"countInfo":{"count": 1}}},{"value": {"countInfo":{"count": 2}}}]}' \
     "http://localhost:8082/topics/test2" | jq .
```


### Consume Avro Records

```
# Create a consumer for Avro data, starting at the beginning of the topic's log
docker compose exec rest-proxy curl -X POST \
     -H "Content-Type: application/vnd.kafka.v2+json" \
     --data '{"name": "ci2", "format": "avro", "auto.offset.reset": "earliest"}' \
     http://localhost:8082/consumers/cg2 | jq .

# Subscribe to a topic
docker compose exec rest-proxy curl -X POST \
     -H "Content-Type: application/vnd.kafka.v2+json" \
     --data '{"topics":["test2"]}' \
     http://localhost:8082/consumers/cg2/instances/ci2/subscription | jq .

# Consume some data using the base URL in the first response.
# Note: Issue this command twice due to https://github.com/confluentinc/kafka-rest/issues/432
docker compose exec rest-proxy curl -X GET \
     -H "Accept: application/vnd.kafka.avro.v2+json" \
     http://localhost:8082/consumers/cg2/instances/ci2/records | jq .

sleep 10

docker compose exec rest-proxy curl -X GET \
     -H "Accept: application/vnd.kafka.avro.v2+json" \
     http://localhost:8082/consumers/cg2/instances/ci2/records | jq .

# Close the consumer with a DELETE to make it leave the group and clean up its resources
docker compose exec rest-proxy curl -X DELETE \
     -H "Content-Type: application/vnd.kafka.v2+json" \
     http://localhost:8082/consumers/cg2/instances/ci2 | jq .
```


### Confluent Cloud Schema Registry

View the schema subjects registered in Confluent Cloud Schema Registry

```
curl -u <SR API KEY>:<SR API SECRET> https://<SR ENDPOINT>/subjects
```

Verify that the subject test2-value exists.

```
["test2-value"]
```

View the schema information for subject test2-value. In the following output, substitute values for <SR API KEY>, <SR API SECRET>, and <SR ENDPOINT>.

```
curl -u <SR API KEY>:<SR API SECRET> https://<SR ENDPOINT>/subjects/test2-value/versions/1
```

Verify the schema information for subject test2-value.

```
{"subject":"test2-value","version":1,"id":100001,"schema":"[{\"type\":\"record\",\"name\":\"countInfo\",\"fields\":[{\"name\":\"count\",\"type\":\"long\"}]}]"}
```

### Stop REST Proxy


```
docker compose down
```



