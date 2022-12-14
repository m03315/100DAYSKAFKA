# REST API

## Show topic configurations

```
curl --silent -H "Authorization: Basic <BASE64-encoded-key-and-secret>" \
--request GET --url 'https://<REST-endpoint>/kafka/v3/clusters/<cluster-id>/topics/<topic-name>/configs'
```


## Find REST endpoint address 


login:
```
confluent login
```

switch environment:
```
confluent environment list

confluent environment use <env-id>
```

list the clusters to get IDs

```
confluent kafka cluster list
```


get cluster deails:  

```
confluent kafka cluster describe <cluster-id>
```


## Create credentials to access the Kafka cluster resources

```
confluent api-key create --resource <cluster-id> --description <key-description>
```


generate a base64 header from API KEY

```
echo -n "<api-key>:<api-secret>" | base64
```



### Store the base64 encoded key and secret in an environment variable for use in commands

```
MYKEY=<alphanumeric string of your base64 encoded API key and secret>
```

check content 

```
echo $MYKEY
```

Use it : "Authorization: Basic $MYKEY"

## List the topics already available on the Kafka cluster

```
curl -H "Authorization: Basic <BASE64-encoded-key-and-secret>" --request GET --url 'https://<REST-endpoint>/kafka/v3/clusters/<cluster-id>/topics'
```


## Create a topic using Cluster Administration for the Kafka API

```
curl -H "Authorization: Basic <BASE64-encoded-key-and-secret>" -H 'Content-Type: application/json' \
--request POST --url 'https://<REST-endpoint>/kafka/v3/clusters/<cluster-id>/topics' \
-d '{"topic_name": "<topic-name>", "partitions_count": <Partitions count>, "replication_factor": <Replication factor>}'
```

example:

```
curl -H "Authorization: Basic ABC123ABC" -H 'Content-Type: application/json' \
--request POST --url 'https://pkc-abcde.us-west4.gcp.confluent.cloud:443/kafka/v3/clusters/lkc-vo9pz/topics' \
-d '{"topic_name": "testTopic1", "partitions_count": 5, "replication_factor": 3}'
```


## Edit the topic configuration

```
curl -H "Authorization: Basic <BASE64-encoded-key-and-secret>" -H 'Content-Type: application/json' \
--request PUT  --url 'https://<REST-endpoint>/kafka/v3/clusters/<cluster-id>/topics/‘<topic-name>/configs/<property-name> \
-d '{"value": “<New value>”}’
```

Example:

```
curl -H "Authorization: Basic ABC123ABC" -H 'Content-Type: application/json' --request PUT  \
--url 'https://pkc-abcde.us-west4.gcp.confluent.cloud:443/kafka/v3/clusters/lkc-vo9pz/topics/testTopic1/configs/retention.ms' \
-d '{"value": "259200000"}'
```

### View the updated topic configuration

```
curl -H "Authorization: Basic <BASE64-encoded-key-and-secret>" --request GET --url 'https://<REST-endpoint>/kafka/v3/clusters/<cluster-id>/topics/<topic-name>/configs/<property-name>’
```

```
curl -H "Authorization: Basic ABC123ABC" --request GET --url 'https://pkc-abcde.us-west4.gcp.confluent.cloud:443/kafka/v3/clusters/lkc-vo9pz/topics/testTopic1/configs/retention.ms'
```

### Batch update topic configurations

```
curl -H "Authorization: Basic <BASE64-encoded-key-and-secret>" -H 'Content-Type: application/json' \
--request POST  --url 'https://<REST-endpoint>/kafka/v3/clusters/<cluster-id>/topics/<topic-name>/configs:alter' \
-d '{"data": [{"name": “<property-name>”, "value": "<new-value>", {"name": “<property-name>”, "value": “<new-value>}…]}’
```

```
curl -H "Authorization: Basic ABC123ABC" -H 'Content-Type: application/json' --request POST  --url 'https://pkc-abcde.us-west4.gcp.confluent.cloud:443/kafka/v3/clusters/lkc-vo9pz/topics/testTopic1/configs:alter' -d '{"data": [{"name": "retention.ms", "value": "172800000"}, {"name": "segment.bytes", "value": "123456789"}]}'
```


## Create a topic and configure properties simultaneously

```
curl --silent -H "Authorization: Basic TOKEN" -H 'Content-Type: application/json' --request POST --url \
'https://pkc-abcde.us-west4.gcp.confluent.cloud:443/kafka/v3/clusters/lkc-vo9pz/topics' \
-d '{"topic_name": "testTopic2", "partitions_count": 4, "replication_factor": 3, "configs":[{"name": "retention.ms", "value": 98765},{"name": "segment.bytes", "value":"98765432"}]}' 
```


## Produce data to the topic

### streaming mode ( recommended for sending a batch of records)

```
curl -X POST -H  "Transfer-Encoding: chunked" -H "Content-Type: application/json" \
-H "Authorization: Basic <BASE64-encoded-key-and-secret>" \
 <REST-endpoint>/kafka/v3/clusters/<cluster-id>/topics/<topic-name>/records -T-
```

### Non-streaming mode (not recommended)

```
 curl -X POST -H "Content-Type: application/json" \
 -H "Authorization: Basic <BASE64-encoded-key-and-secret>" \
 '<REST-endpoint>/kafka/v3/clusters/<cluster-id>/topics/<topic-name>/records' -d \
'{"value": {"type": "<type>", "data": "<data>"}}'
```


## Delete the topics

delete a topic
```
curl -H "Authorization: Basic <BASE64-encoded-key-and-secret>" -H 'Content-Type: application/json' --request DELETE  --url 'https://<REST-endpoint>/kafka/v3/clusters/<cluster-id>/topics/<topic-name>'

curl -H "Authorization: Basic ABC123ABC" -H 'Content-Type: application/json' --request DELETE  --url 'https://pkc-abcde.us-west4.gcp.confluent.cloud:443/kafka/v3/clusters/lkc-vo9pz/topics/‘testTopic1'

curl -H "Authorization: Basic ABC123ABC" -H 'Content-Type: application/json' --request DELETE  --url 'https://pkc-abcde.us-west4.gcp.confluent.cloud:443/kafka/v3/clusters/lkc-vo9pz/topics/‘testTopic2'

```

Confirm that topic was deleted by listing the topics in the cluster

```
curl -H "Authorization: Basic <BASE64-encoded-key-and-secret>" --request GET --url 'https://<REST-endpoint>/kafka/v3/clusters/<cluster-id>/topics'

curl -H "Authorization: Basic ABC123ABC" --request GET --url 'https://pkc-abcde.us-west4.gcp.confluent.cloud:443/kafka/v3/clusters/lkc-vo9pz/topics'
```



