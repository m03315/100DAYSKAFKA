# kcat

## install kcat 

```
sudo apt-get install kafkacat
```


## create a local config file

```
touch ~/.confluent/librdkafka.config
```

### Template configuration
```
# Required connection configs for Kafka producer, consumer, and admin
bootstrap.servers={{ BROKER_ENDPOINT }}
security.protocol=SASL_SSL
sasl.mechanisms=PLAIN
sasl.username={{ CLUSTER_API_KEY }}
sasl.password={{ CLUSTER_API_SECRET }}

# Best practice for higher availability in librdkafka clients prior to 1.7
session.timeout.ms=45000
```


## get kcat sample 

```
git clone https://github.com/confluentinc/examples
cd examples
git checkout 7.3.0-post
```

```
cd clients/cloud/kcat/
```


## Produce & Consume Records 

```
confluent kafka topic create --if-not-exists test1
```


replace examples/clients/cloud/kcat/kcat-example.sh by [kcat-example.sh](kcat-example.sh)


RUN 

```
./kcat-example.sh
```


