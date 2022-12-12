# Read from a specific offset and partition 


## Cluster Config

rename [ccloud-template.properties](configuration/ccloud-template.properties)  to ccloud.properties


## create a new topic through Confluent CLI

```
confluent kafka topic create example-topic --partitions 2
```


## Produce records with keys and values 

```
confluent kafka topic produce example-topic --parse-key --delimiter ":"
```

add new records 

```
key1:the lazy
key2:fox jumped
key3:over the
key4:brown cow
key1:All
key2:streams
key3:lead
key4:to
key1:Kafka
key2:Go to
key3:Kafka
key4:summit
```

## start a new consumer to read from the first partition

```
docker run -v $PWD/configuration/ccloud.properties:/tmp/ccloud.properties confluentinc/cp-kafka:7.3.0 \
  bash -c 'kafka-console-consumer \
    --topic example-topic \
    --bootstrap-server `grep "^\s*bootstrap.server" /tmp/ccloud.properties | tail -1` \
    --consumer.config /tmp/ccloud.properties \
    --from-beginning \
    --property print.key=true \
    --property key.separator="-" \
    --partition 0'
```

## start a new consumer to read from the second partition

```
docker run -v $PWD/configuration/ccloud.properties:/tmp/ccloud.properties confluentinc/cp-kafka:7.3.0 \
  bash -c 'kafka-console-consumer \
    --topic example-topic \
    --bootstrap-server `grep "^\s*bootstrap.server" /tmp/ccloud.properties | tail -1` \
    --consumer.config /tmp/ccloud.properties \
    --from-beginning \
    --property print.key=true \
    --property key.separator="-" \
    --partition 1'
```

## read records starting from a specific offset

```
docker run -v $PWD/configuration/ccloud.properties:/tmp/ccloud.properties confluentinc/cp-kafka:7.3.0 \
  bash -c 'kafka-console-consumer \
    --topic example-topic \
    --bootstrap-server `grep "^\s*bootstrap.server" /tmp/ccloud.properties | tail -1` \
    --consumer.config /tmp/ccloud.properties \
    --property print.key=true \
    --property key.separator="-" \
    --partition 1 \
    --offset 3'
```

