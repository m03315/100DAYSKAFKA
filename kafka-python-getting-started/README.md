# Python 

## set up a virtual environment:

Create and activate a Python virtual environment to give yourself a clean, isolated workspace:

```
virtualenv env

source env/bin/activate
```

> Using Python 3.x

## install the kafka library:

```
pip install confluent-kafka
```

## get running kafka instances informations

### LOCAL 

use ../initial/docker-compose.yaml

```
docker-compose -d
```

### CLOUD

Confluent -> Cluster Overview -> Cluster settings -> get Bootstrap server info



## Configuration

### Confluent Cloud
rename getting_started_template.ini file to getting_started.ini

replace below configs with yours : 

- bootstrap.servers
- sasl.username
- sasl.password

### Local 

paste following configs into getting_start.ini file

```
[default]
bootstrap.servers=localhost:9092

[consumer]
group.id=python_example_group_1

# 'auto.offset.reset=earliest' to start reading from the beginning of
# the topic if no committed offsets exist.
auto.offset.reset=earliest
```

## Create Topic 

Create a new topic "purchases" with 1 partition

### Confluent Cloud 

use console add a new topic

### Local 

```
docker compose exec broker \
  kafka-topics --create \
    --topic purchases \
    --bootstrap-server localhost:9092 \
    --replication-factor 1 \
    --partitions 1
```




## Build Producer


producer.py

### Produce Event 

```
chmod u+x producer.py

./producer.py getting_started.ini
```

## Build Consumer

consumer.py

### Consume Events

```
chmod u+x consumer.py

./consumer.py getting_started.ini
```







