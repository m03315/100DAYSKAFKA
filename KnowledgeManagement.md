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

## KRaft:

- early access and should be used in development only
- not suitable for production
- use new quorum controller service in kafka wich replaces the previous controller and makes use of an event based variant of the Raft consensus protocol

### New quorum controller

- Enable cluster to scale to millions of partitions through improved control plane performance with new metadata management
- Improve stability, makes it easier to monitor, administer and support kafka.
- Provide a lightwight, single process way to get start with kafka
- make controller failover near-instantaneous 


## Avro

Avro is an open source data serialization system that helps with data exchange between systems, programming languages, and processing frameworks.

It has a JSON like data model.

Arvo is the best chose for thses reasons:

- a direct mapping to and from JSON
- a very compact format. The bulk of JSON, repeating every field name with every single record, is what makes JSON inefficient for high-volume usage.
- very fast
- It has great bindings for a wide variety of programming languages so you can generate Java objects that make working with event data easier, but it does not require code generation so tools can be written generically for any data stream.
- a rich, extensible schema language defined in pure JSON
- the best notion of compatibility for evolving your data over time.
- a rich, extensible schema language defined in pure JSON
- the best notion of compatibility for evolving your data over time

an example:
```
{
  "time": 1424849130111,
  "customer_id": 1234,
  "product_id": 5678,
  "quantity":3,
  "payment_type": "mastercard"
}
```

schema:

```
{
  "time": 1424849130111,
  "customer_id": 1234,
  "product_id": 5678,
  "quantity":3,
  "payment_type": "mastercard"
}
```

The schemas end up serving a number of critical purposes:

- let the producers or consumers of data streams know the right fields are need in an event and what type each field is.
- document the usage of the event and the meaning of each field in the “doc” fields.
- protect downstream data consumers from malformed data, as only valid data will be permitted in the topic.

when done right
- a huge boon
- keep your data clean
- make everyone more agile

Much of the reaction to scheams comes from two factors:
- historical limitations in relational databases that make schema changes difficult
- the immaturity of much of the modern distributed infrastructure which simply hasn’t had the time yet to get to the semantic layer of modeling done.

### Robustness
data modeled as stream => appliation are decoupled
Applications produce a stream of events capturing what occurred without knowledge of which things subscribe to these streams.

Testing all combinations is infeasible. In the absence of any real schema, new producers to a data stream will do their best to imitate existing data but jarring inconsistencies arise—certain magical string constants aren’t copied consistently, important fields are omitted, and so on.

### Clarity and Semantics

Invariably you end up with a sort of informal plain english “schema” passed around between users of the data via wiki or over email which is then promptly lost or obsoleted by changes that don’t update this informal definition. We found this lack of documentation lead to people guessing as to the meaning of fields, which inevitably leads to bugs and incorrect data analysis when these guesses are wrong.

### Compatibility

Schemas also help solve one of the hardest problems in organization-wide data flow: modeling and handling change in data format. Schema definitions just capture a point in time, but your data needs to evolve with your business and with your code. There will always be new fields, changes in how data is represented, or new data streams. This is a problem that databases mostly ignore. A database table has a single schema for all it’s rows. But this kind of rigid definition won’t work if you are writing many applications that all change at different times and evolve the schema of shared data streams. If you have dozens of applications all using a central data stream they simply cannot all update at once.

Schemas make it possible for systems with flexible data format like Hadoop or Cassandra to track upstream data changes and simply propagate these changes into their own storage without expensive reprocessing. Schemas give a mechanism for reasoning about which 
format changes will be compatible and (hence won’t require reprocessing) and which won’t.

a large scale streaming platform without schemas controlling the correctness of data have lead to serious instability at scale.

### Schemas are a Conversation

Dynamically typed languages have an important role to play. And arguably databases, when used by a single application in a service-oriented fashion, don’t need to enforce a schema, since, after all, the service that owns the data is the real “schema” enforcer to the rest of the organization.

### Schemas Eliminate The Manual Labor of Data Science

Data scientists complain that their training spent too much time on statistics and algorithms and too little on regular expressions, XML parsing, and practical data munging skills. This is quite true in most organizations, but it is somewhat disappointing that there are people with PhDs in Physics spending their time trying to regular-expression date fields out of mis-formatted CSV data (that inevitably has commas inside the fields themselves).

The advantage isn’t limited to parsing. Much of what is done in this kind of data wrangling is munging disparate representations of data from various systems to look the same. It will turn out that similar business activities are captured in dramatically different ways in different parts of the same business. Building post hoc transformations can attempt to coerce these to look similar enough to perform analysis. However the same thing is possible at data capture time by just defining an enterprise-wide schema for common activities. If sales occur in 14 different business units it is worth figuring out if there is some commonality among these that can be enforced so that analysis can be done over all sales without post-processing. Schemas won’t automatically enforce this kind of thoughtful data modeling but they do give a tool by which you can enforce a standard like this.


### At LinkedIn

We put this idea of schemafied event data into practice at large scale at LinkedIn. User activity events, metrics data, stream processing output, data computed in Hadoop, and database changes were all represented as streams of Avro events.

These events were automatically loaded into Hadoop. When a new Kafka topic was added that data would automatically flow into Hadoop and a corresponding Hive table would be created using the event schema. When the schema evolved that metadata was propagated into Hadoop. When someone wanted to create a new data stream, or evolve the schema for an existing one, the schema for that stream would undergo a quick review by a group of people who cared about data quality. This review would ensure this stream didn’t duplicate an existing event and that things like dates and field names followed the same conventions, and so on. Once the schema change was reviewed it would automatically flow throughout the system. This leads to a much more consistent, structured representation of data throughout the organization.

Other companies we have worked with have largely come to the same conclusion. Many started with loosely structured JSON data streams with no schemas or contracts as these were the easiest to implement. But over time almost all have realized that this loose definition simply doesn’t scale beyond a dozen people and that some kind of stronger metadata is needed to preserve data quality.


 We chose Avro as a schema representation language after evaluating all the common options—JSON, XML, Thrift, protocol buffers, etc. We recommend it because it is the best thought-out of these for this purpose. It has a pure JSON representation for readability but also a binary representation for efficient storage. It has an exact compatibility model that enables the kind of compatibility checks described above. It’s data model maps well to Hadoop data formats and Hive as well as to other data systems. It also has bindings to all the common programming languages which makes it convenient to use programmatically


Effective Avro : 

- Use enumerated values whenever possible instead of magic strings. Avro allows specifying the set of values that can be used in the schema as an enumeration. This avoids typos in data producer code making its way into the production data set that will be recorded for all time.
- Require documentation for all fields. Even seemingly obvious fields often have non-obvious details. Try to get them all written down in the schema so that anyone who needs to really understand the meaning of the field need not go any further.
- Avoid non-trivial union types and recursive types. These are Avro features that map poorly to most other systems. Since our goal is an intermediate format that maps well to other systems we want to avoid any overly advanced features.
- Enforce reasonable schema and field naming conventions. Since these schemas will map into Hadoop having common fields like customer_id named the same across events will be very helpful in making sure that joins between these are easy to do. A reasonable scheme might be something like PageViewEvent, OrderEvent, ApplicationBounceEvent, etc.


