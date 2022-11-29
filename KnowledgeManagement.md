# Knwoledge Management


## Events 

**KAFKA** is an event streaming platform

Data operations at scale: 
- collect
- process
- store
- integrate

An event : 
- a description of what happened
- a combination of notification and state
- normally represented in some structured format, such as JSON or an object serialized 

Key/Value Paris : 
- Key can be complex domain objects but are often primitive types like strings or integers.
- Values are typically the serialized representation of an application domain object or some form of raw message

## Topics 

- fundamental unit of organization
- differents topics to hold differents kinds of events 
- critical component in modern data infrastructure

## Partitions

- break a topic up into partitions
- if a message has no key, subsequent messages will be distributed round-robin among all the topic’s partitions.
- if the message does have a key, then the destination partition will be computed from a hash of the key
- messages having the same key always land in the same partition and always in order
- partitions will affect the distribution of data across the topic
- when create a partition, think about how many partitions need

## Brokers

- a network of machines
- an computer, instance or container running the KAFKA process
- manage partitions
- handle write and read requests 
- manage replication of partitions

goal ->  fast & scale easily 

## Replication

- copies of data fro fault tolerance
- one lead partition and N-1 followers
- write and read only happen to the leader
- an invisible process to most developers
- tunable in the producer 

## Producers

- client application
- put messages into topics
- connection pooling
- network buffering
- partitioning

## Consumers

- client application
- read messages from topics
- connection pooling
- network protocol
- horizontally and elastically scalable
- maintain ordering within partitions at scale

## Ecosystem

- Topics, partitions, events are functionality around core Kafka
- These functionalities will not contribute value directly to your customers
- Don't build common layers of application functionality to repeat certain undifferentiated tasks

## Kafka Connect

- Data intergration system and ecosystem
- External systems are not Kafka
- External client process; does not run on Brokers
- Horizontal scalable
- Fault tolerant 
- Declarative
- Pluggable software component
- Interface to external systems and to Kafka
- exist as runtime entities
- source connectors act as producers
- Sink connectors acts as consumers


## Schema Registry

- server process external to Kafka brokers
- maintains a database of schemas
- HA deployment option available
- Consumer/Producer API component
- Define schema compatibility rules per topic
- Producer API prevents incompatible messages from being produced
- Consumer API prevents incompatible messages from being consumed

### Supported Formats

- JSON Schema
- Avro
- Protocol Buffers 

## Kafka Streams

- Functional Java API
- Filtering, grouping, aggregating, joining, and more
- Scalable, fault-tolerant state management
- Scalable computation based on Consumer Groups
- Integate within your services as a library
- Runs in the context of your application
- Does not require special infrastructure 

> Get your hands dirty with codes

## ksqlDB

- A database optimized for stream processing
- Runs on its own scalable,fault-tolerant cluster adjacent to the kafka cluster
- Stream processing programs written in SQL
- Command-line interface
- REST API for application integration
- JAVA library
- Kafka Connect integration

we can do : 

create a stream from existing topic -> run SQL query from this new stream 






