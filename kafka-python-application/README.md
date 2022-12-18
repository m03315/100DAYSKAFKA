# Python: Code Example for Apache Kafka


## Install requirements

```
virtualenv ccloud-venv
source ./ccloud-venv/bin/activate
pip install -r requirements.txt
```



## Configuration

replace configs values in this [librdkafka.config](librdkafka.config) by yours

## Basic Producer and Consumer

### Produce Records

```
./producer.py -f librdkafka.config -t test1
```

[producer code](producer.py)


### Consume Records

```
./consumer.py -f librdkafka.config -t test1
```

[consumer code](consumer.py)


## Avro And Confluent Cloud Schema Registry

```
curl -u {{ SR_API_KEY }}:{{ SR_API_SECRET }} https://{{ SR_ENDPOINT }}/subjects
```

### Produce Avro Records

```
./producer_ccsr.py -f  librdkafka.config -t test2
```

[producer Avro code](producer_ccsr.py)


### Consume Avro Records

```
./consumer_ccsr.py -f librdkafka.config -t test2
```

[consumer Avro code](consumer_ccsr.py)


## Confluent Cloud Schema Registry

```
curl -u <SR API KEY>:<SR API SECRET> https://<SR ENDPOINT>/subjects
```

Verify that the subject test2-value exists
```
["test2-value"]
```

View the schema information for subject test2-value. In the following output, substitute values for <SR API KEY>, <SR API SECRET>, and <SR ENDPOINT>.

```
curl -u <SR API KEY>:<SR API SECRET> https://<SR ENDPOINT>/subjects/test2-value/versions/1
```

Verify the schema information for subject test2-value.

```
{"subject":"test2-value","version":1,"id":100001,"schema":"{\"name\":\"io.confluent.examples.clients.cloud.DataRecordAvro\",\"type\":\"record\",\"fields\":[{\"name\":\"count\",\"type\":\"long\"}]}"}
```

## Run all the code in Docker

Use this [Dockerfile](Dockerfile) file

```
docker build -t cloud-demo-python .
```

Run the Docker image using the following command:

```
docker run -v librdkafka.config:/root/.confluent/librdkafka.config -it --rm cloud-demo-python bash
```

Run the Python applications from within the container shell

```
./producer.py -f $HOME/.confluent/librdkafka.config -t test1
./consumer.py -f $HOME/.confluent/librdkafka.config -t test1
./producer_ccsr.py -f $HOME/.confluent/librdkafka.config -t test2
./consumer_ccsr.py -f $HOME/.confluent/librdkafka.config -t test2
```











