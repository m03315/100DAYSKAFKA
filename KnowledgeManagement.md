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

## Using Broker-Side schema validation

Schema Validation enables the broker to verify that data produced to a Kafka topic is using a valid schema ID in Schema Registry

### Prerequisites

- Schema Validation on Confluent Cloud is only available on dedicated clusters through the hosted Schema Registry. Confluent Cloud brokers cannot use self-managed instances of Schema Registry, only the Confluent Cloud hosted Schema Registry. (Schema validation is available for on-premises deployments through Confluent Enterprise).
- You must have a Schema Registry enabled for the environment in which you are using Schema Validation.
- Schema Validation is bounded at the level of an environment. All dedicated clusters in the same environment share a Schema Registry. Clusters do not have visibility into schemas across different environments.


### Schema Validation Configuration options on a topic

Schema Validation is set at the topic level with the following parameters.

| Property      | Description |
| ----------- | ----------- |
| confluent.key.schema.validation | When set to true, enables schema ID validation on the message key. The default is false.    |
| confluent.value.schema.validation | When set to true, enables schema ID validation on the message value. The default is false.      |
| confluent.key.subject.name.strategy | Set the subject name strategy for the message key. The default is io.confluent.kafka.serializers.subject.TopicNameStrategy. |
| confluent.value.subject.name.strategy | Set the subject name strategy for the message value. The default is io.confluent.kafka.serializers.subject.TopicNameStrategy. |

>
> - Value schema and key schema validation are independent of each other; you can enable either or both.
> - The subject naming strategy is tied to Schema Validation. This will have no effect when Schema Validation is not enabled.

### Enable Schema Validation from the Confluent CLI
```
confluent kafka topic <create|update> <topic-name> --config confluent.<key|value>.schema.validation=true
```
creates a topic called flights with schema validation enabled on the value schema:
```
confluent kafka topic create flights --config confluent.value.schema.validation=true
```

With this configuration, if a message is produced to the topic flights that does not have a valid schema for the value of the message, an error is returned to the producer, and the message is discarded.

If a batch of messages is sent and at least one is invalid, then the entire batch is discarded.

If you do not specify a different subject naming strategy, io.confluent.kafka.serializers.subject.TopicNameStrategy is used by default. You can modify the naming strategies used for either or both the message key and message value schemas. For example, the following command sets the subject naming strategy on the topic flights to use io.confluent.kafka.serializers.subject.RecordNameStrategy.

```
confluent kafka topic update flights --config confluent.value.subject.name.strategy=io.confluent.kafka.serializers.subject.RecordNameStrategy
```
The following naming strategies are available as accepted values for confluent.value.subject.name.strategy.


| Strategy      | Description |
| ----------- | ----------- |
|  TopicNameStrategy           | Derives subject name from topic name. (This is the default.)            |
| RecordNameStrategy | 	Derives subject name from record name, and provides a way to group logically related events that may have different data structures under a subject. |
| TopicRecordNameStrategy | Derives the subject name from topic and record name, as a way to group logically related events that may have different data structures under a subject. |

The full class names for the above strategies consist of the strategy name prefixed by io.confluent.kafka.serializers.subject.

### Enable Schema Validation on a topic from the Confluent Cloud Console

- navigate to a topic
- click Configuration tab
- Click Edit Settings
- Click Switch to expert mode
- In Expert mode, change the settings for confluent.value.schema.validation and/or confluent.key.schema.validation from false to true.

If you do not specify a different naming strategy, TopicNameStrategy is used by default.

You can modify the naming strategies used for either or both the message key and message value schemas. These settings are also available in Expert mode on the selected topic. Set these now, if desired.

### Schema Validation Demo
1. Create a test topic called players-maple either from the web UI or the Confluent CLI. Do not specify the Schema Validation setting, so that your topic defaults to false.

```
confluent kafka topic create players-maple
```
2. In a new command window for the producer (logged into Confluent Cloud and on the same environment and cluster), run this command to produce a serialized record (using the default string serializer) to the topic players-maple.

```
confluent kafka topic produce players-maple --parse-key=true --delimiter=,
```

Type your first message at the producer prompt as follows:
```
1,Pierre
```
3. Open a new command window for the consumer (logged into Confluent Cloud and on the same environment and cluster), and enter this command to read the messages:

```
confluent kafka topic consume players-maple --from-beginning --print-key=true
```
4. Now, set Schema Validation for the topic players-maple to true.

```
confluent kafka topic update players-maple --config confluent.value.schema.validation=true
```

5. Return to the producer session, and type a second message at the prompt

```
2,Frederik
```
You will get an error because Schema Validation is enabled and the messages we are sending do not contain schema IDs: Error: producer has detected an INVALID_RECORD error for topic players-maple

If you subsequently disable Schema Validation (use the same command to set it to false), then type and resend the same or another similarly formatted message, the message will go through

### What Schema Validation checks and how it works

When Schema Validation is enabled on a topic, it checks for the following on each message:

- The message produced to the topic has an associated schema. (The message must have an associated schema ID, which indicates it has a schema.)
- The schema must match the topic.

In practice, you would typically send an Avro object, Protobuf object, or Jackson-serializable POJO as a function of a client application. In this case, Schema Validation derives the schema based on the object. The schema is sent to Schema Registry, which checks to see if the schema exists in the subject. If it does, Schema Registry uses the schema ID of that version. If it doesn’t, Schema Registry throws an error if the client has auto schema registration set to false, or will register the schema if the client has auto schema registration set to true.

Auto schema registration is set in the client application. By default, client applications automatically register new schemas. You can disable auto schema registration on your clients, which is typically recommended in production environments.

## Schema Evolution and Compatibility

When using Avro or other schema formats, one of the most important things is to manage the schemas and consider how these schemas should evolve

Schema compatibility checking is implemented in Schema Registry by versioning every single schema. The compatibility type determines how Schema Registry compares the new schema with previous versions of a schema, for a given subject. When a schema is first created for a subject, it gets a unique id and it gets a version number, i.e., version 1. When the schema is updated (if it passes compatibility checks), it gets a new unique id and it gets an incremented version number, i.e., version 2.

### Compatibility Types

 The Confluent Schema Registry default compatibility type is BACKWARD
 
 
|Compatibility Type	| Changes allowed	| Check against which schemas	| Upgrade first |
| ----------- | ----------- | ----------- | ----------- |
| BACKWARD	| Delete fields Add optional fields | Last version	| Consumers |
| BACKWARD_TRANSITIVE | Delete fields Add optional fields | All previous versions	| Consumers |
| FORWARD | Add fields Delete optional fields | Last version	| Producers |
| FORWARD_TRANSITIVE | Add fields Delete optional fields | All previous versions	| Producers |
| FULL	| Add optional fields Delete optional fields | Last version	| Any order |
| FULL_TRANSITIVE | Add optional fields Delete optional fields | All previous versions	| Any order |
| NONE	| All changes are accepted | Compatibility checking disabled	| Depends |


### Backward Compatibility

BACKWARD compatibility means that consumers using the new schema can read data produced with the last schema. For example, if there are three schemas for a subject that change in order X-2, X-1, and X then BACKWARD compatibility ensures that consumers using the new schema X can process data written by producers using schema X or X-1, but not necessarily X-2. If the consumer using the new schema needs to be able to process data written by all registered schemas, not just the last two schemas, then use BACKWARD_TRANSITIVE instead of BACKWARD. For example, if there are three schemas for a subject that change in order X-2, X-1, and X then BACKWARD_TRANSITIVE compatibility ensures that consumers using the new schema X can process data written by producers using schema X, X-1, or X-2.

BACKWARD: consumer using schema X can process data produced with schema X or X-1
BACKWARD_TRANSITIVE: consumer using schema X can process data produced with schema X, X-1, or X-2


The main reason that BACKWARD compatibility mode is the default, and preferred for Kafka, is so that you can rewind consumers to the beginning of the topic. With FORWARD compatibility mode, you aren’t guaranteed the ability to read old messages.

Also FORWARD compatibility mode is harder to work with. In a sense, you need to anticipate all future changes. For example, in FORWARD compatibility mode with Protobuf, you cannot add new message types to a schema.


Consider the case where all of the data in Kafka is also loaded into HDFS, and you want to run SQL queries (for example, using Apache Hive) over all the data. Here, it is important that the same SQL queries continue to work even as the data is undergoing changes over time. To support this kind of use case, you can evolve the schemas in a backward compatible way. 

Avro implementation details: Take a look at ResolvingDecoder in the Apache Avro project to understand how, for data that was encoded with an older schema, Avro decodes that data with a newer, backward-compatible schema.


### Forward Compatibility

FORWARD compatibility means that data produced with a new schema can be read by consumers using the last schema, even though they may not be able to use the full capabilities of the new schema. For example, if there are three schemas for a subject that change in order X-2, X-1, and X then FORWARD compatibility ensures that data written by producers using the new schema X can be processed by consumers using schema X or X-1, but not necessarily X-2. If data produced with a new schema needs to be read by consumers using all registered schemas, not just the last two schemas, then use FORWARD_TRANSITIVE instead of FORWARD. For example, if there are three schemas for a subject that change in order X-2, X-1, and X then FORWARD_TRANSITIVE compatibility ensures that data written by producers using the new schema X can be processed by consumers using schema X, X-1, or X-2.

FORWARD: data produced using schema X can be read by consumers with schema X or X-1
FORWARD_TRANSITIVE: data produced using schema X can be read by consumers with schema X, X-1, or X-2
An example of a forward compatible schema modification is adding a new field. In most data formats, consumers that were written to process events without the new field will be able to continue doing so even when they receive new events that contain the new field.

 
 Consider a use case where a consumer has application logic tied to a particular version of the schema. When the schema evolves, the application logic may not be updated immediately. Therefore, you need to be able to project data with newer schemas onto the (older) schema that the application understands. To support this use case, you can evolve the schemas in a forward compatible way: data encoded with the new schema can be read with the old schema. For example, the new user schema shown in the previous section on backward compatibility is also forward compatible with the old one. When projecting data written with the new schema to the old one, the new field is simply dropped. Had the new schema dropped the original field favorite_number (number, not color), it would not be forward compatible with the original user schema since consumers wouldn’t know how to fill in the value for favorite_number for the new data because the original schema did not specify a default value for that field.


### Full Compatibility
FULL compatibility means schemas are both backward and forward compatible. Schemas evolve in a fully compatible way: old data can be read with the new schema, and new data can also be read with the last schema. For example, if there are three schemas for a subject that change in order X-2, X-1, and X then FULL compatibility ensures that consumers using the new schema X can process data written by producers using schema X or X-1, but not necessarily X-2, and that data written by producers using the new schema X can be processed by consumers using schema X or X-1, but not necessarily X-2. If the new schema needs to be forward and backward compatible with all registered schemas, not just the last two schemas, then use FULL_TRANSITIVE instead of FULL. For example, if there are three schemas for a subject that change in order X-2, X-1, and X then FULL_TRANSITIVE compatibility ensures that consumers using the new schema X can process data written by producers using schema X, X-1, or X-2, and that data written by producers using the new schema X can be processed by consumers using schema X, X-1, or X-2.

FULL: backward and forward compatibile between schemas X and X-1
FULL_TRANSITIVE: backward and forward compatibile between schemas X, X-1, and X-2
In Avro and Protobuf, you can define fields with default values. In that case, adding or removing a field with a default value is a fully compatible change.

### No Compatibility Checking
NONE compatibility type means schema compatibility checks are disabled.

Sometimes we make incompatible changes. For example, modifying a field type from Number to String. In this case, you will either need to upgrade all producers and consumers to the new schema version at the same time, or more likely – create a brand-new topic and start migrating applications to use the new topic and new schema, avoiding the need to handle two incompatible versions in the same topic.

### Transitive Property

Transitive compatibility checking is important once you have more than two versions of a schema for a given subject. If compatibility is configured as transitive, then it checks compatibility of a new schema against all previously registered schemas; otherwise, it checks compatibility of a new schema only against the latest schema.

For example, if there are three schemas for a subject that change in order X-2, X-1, and X then:

transitive: ensures compatibility between X-2 <==> X-1 and X-1 <==> X and X-2 <==> X
non-transitive: ensures compatibility between X-2 <==> X-1 and X-1 <==> X, but not necessarily X-2 <==> X

Refer to an example of schema changes which are incrementally compatible, but not transitively so.

The Confluent Schema Registry default compatibility type BACKWARD is non-transitive, which means that it’s not BACKWARD_TRANSITIVE. As a result, new schemas are checked for compatibility only against the latest schema.

### Order of Upgrading Clients

The configured compatibility type has an implication on the order for upgrading client applications, i.e., the producers using schemas to write events to Kafka and the consumers using schemas to read events from Kafka. Depending on the compatibility type:

- BACKWARD or BACKWARD_TRANSITIVE: there is no assurance that consumers using older schemas can read data produced using the new schema. Therefore, upgrade all consumers before you start producing new events.
- FORWARD or FORWARD_TRANSITIVE: there is no assurance that consumers using the new schema can read data produced using older schemas. Therefore, first upgrade all producers to using the new schema and make sure the data already produced using the older schemas are not available to consumers, then upgrade the consumers.
- FULL or FULL_TRANSITIVE: there are assurances that consumers using older schemas can read data produced using the new schema and that consumers using the new schema can read data produced using older schemas. Therefore, you can upgrade the producers and consumers independently.
- NONE: compatibility checks are disabled. Therefore, you need to be cautious about when to upgrade clients.

### For Kafka Streams only BACKWARD compatibility is supported.

For a plain consumer, it is safe to upgrade the consumer to the new schema after the producer is upgraded because a plain consumer reads only from the input topic. For Kafka Streams, the scenario is different. When you upgrade Kafka Streams, it also can read from the input topic (that now contains data with the new schema). However, in contrast to a plain consumer, Kafka Streams must also be able to read the old schema (from the state/changelog); therefore, only BACKWARD compatibility is supported. The Kafka Streams apps must be upgraded first, then it safe to upgrade the upstream producer that writes into the input topic.

FULL and TRANSITIVE compatibility are always supported for Kafka Streams, as they include backward compatibility and so are, in effect, “stronger” settings than BACKWARD.


### Examples

[Avro compatibility test suite](https://github.com/confluentinc/schema-registry/blob/master/core/src/test/java/io/confluent/kafka/schemaregistry/avro/AvroCompatibilityTest.java)

### Using Compatibility Types

1.To check the currently configured compatibility type, view the configured setting:

Using the Schema Registry REST API.
To set the compatibility level, you can configure it in the following ways:

1.In your client application.
2.Using the Schema Registry REST API.
3.Using the Control Center Edit Schema feature. See Manage Schemas for Topics in Control Center.

A REST API call to compatibility mode is global meaning it overrides any compatibility parameters set in schema registry properties files, as shown in the API usage example Update compatibility requirements globally.







