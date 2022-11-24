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






