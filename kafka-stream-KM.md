# Kafka Streams

Apache Kafka is a distributed, scalable, elastic, and fault tolerant event-streaming platform.

## Logs, Brokers and Topics

- Log is a immputable file where records are appended, can't store an infinite amount of data, can configure how long your records live
- Broker is the storage layer, the log resides on the broker's filesystem
-  Topic is a logical construct that names the log, a directoy within the broker's filesystem.

## Producer and Consumer
Producers send a produce request with records to the log, and each record arrives with a given special numer called offset, a logical position that record in the log.

Consumers send a fetch request to read records and use the offsets to bookmark.

Consumers are organized into groups, with partition data distributed among the members of the group.

## Connectors

an abstraction over producers and consumers 

## Streaming Engine

Kafka Streams is a Java Library 

```
{
  "reading_ts": "2020-02-14T12:19:27Z",
  "sensor_id": "aa-101",
  "production_line": "w01",
  "widget_type": "acme94",
  "temp_celsius": 23,
  "widget_weight_g": 100
}
```

## Processing Data: Vanilla Kafka vs. Kafka Streams
 create a producer and consumer, and then subscribe to the single topic widgets. Then you poll() your records, and the ConsumerRecords collection is returned. You loop over the records and pull out values, filtering out the ones that are red. Then you take the "red" records, create a new ProducerRecord for each one, and write those out to the widgets-red topic.

 ```
public static void main(String[] args) {
 try(Consumer<String, Widget> consumer = new KafkaConsumer<>(consumerProperties());
    Producer<String, Widget> producer = new KafkaProducer<>(producerProperties())) {
        consumer.subscribe(Collections.singletonList("widgets"));
        while (true) {
            ConsumerRecords<String, Widget> records =    consumer.poll(Duration.ofSeconds(5));
                for (ConsumerRecord<String, Widget> record : records) {
                    Widget widget = record.value();
                    if (widget.getColour().equals("red") {
                        ProducerRecord<String, Widget> producerRecord = new ProducerRecord<>("widgets-red", record.key(), widget);
                        producer.send(producerRecord, (metadata, exception)-> {…….} );
               …
 ```

Kafka Streams: 

```
final StreamsBuilder builder = new StreamsBuilder();
builder.stream(“widgets”, Consumed.with(stringSerde, widgetsSerde))
    .filter((key, widget) -> widget.getColour.equals("red"))
    .to("widgets-red", Produced.with(stringSerde, widgetsSerde));
```
Instantiate a StreamsBuilder, then you create a stream based off of a topic and give it a SerDes. Then you filter the records and write back out to the widgets-red topic.

## Basic Operations

### Events streams 

An event represents data corresponds to an action, such as a notification or state transfer.

An event stream is an unbounded collection of event records.

key-value pairs, records have the same key don't have anything to do with one another, event theirs keys are identical.

### Topologies

Flow of stream processing, Kafka Streams uses topologies, which are directed acyclic graphs (DAGs)

- Source Processor
- Stream Processor
- Stream
- Sink Processor

Each Kafka Stream topology has a source processor, where records are read in from Kafka.  A child node could have multiple parent nodes, and a parent node can have multiple child nodes. It all feeds down to a sink processor, which writes out to Kafka.

### Streams

You define a stream with a StreamBuilder, for which you specify an input topic as well as SerDes configurations, via a Consumed configuration object. 
```
StreamBuilder builder = new StreamBuilder();
KStream<String, String> firstStream = 
builder.stream(inputTopic, Consumed.with(Serdes.String(), Serdes.String()));
```
A KStream is part of the Kafka Streams DSL, and it’s one of the main constructs you'll be working with.


### Stream Operations

- Mapping:

With mapping, you take an input object of one type, apply a function to it, and then output it as a different object, potentially of another type.

using mapValues, you could convert a string to another string that omits the first five characters
```
mapValues(value -> value.substring(5))
```

Map, on the other hand, lets you change the key and the value:
```
map((key, value) -> ..)
```

- Filterings:

With a filter, you send a key and value, and only the records that match a predicate make it through to the other side.
```
filter((key, value) -> Long.parseLong(value) > 1000)
```


## KTable

### Update Streams

Update Streams are the exact opposite: if a new record comes in with the same key as an existing record, the existing record will be overwritten.

### Defining a KTable
To define a KTable, you use a StreamBuilder, as with a KStream, but you call builder.table instead of builder.stream. With the builder.table method, you provide an inputTopic, along with a Materialized configuration object specifying your SerDes (this replaces the Consumed object that you use with a KStream):
```
 StreamBuilder builder = new StreamBuilder();
 KTable<String, String> firstKTable = 
    builder.table(inputTopic, 
    Materialized.with(Serdes.String(), Serdes.String()));
```

### KTable Operations

Mapping : 
As with KStream, mapValues transforms values and map lets you transform both keys and values.

```
firstKTable.mapValues(value -> ..)
firstKTable.map((key,value) -> ..)
```

Filtering : 

As with KStream, the filter operation lets you supply a predicate, and only records that match the predicate are forwarded to the next node in the topology:

```
firstKTable.filter((key, value) -> ..)
```

### GlobalKTable

A GlobalKTable is built using the GlobalKTable method on the StreamBuilder. As with a regular KTable, you pass in a Materialized configuration with the SerDes:

```
 StreamBuilder builder = new StreamBuilder();
 GlobalKTable<String, String> globalKTable = 
    builder.globalTable(inputTopic, 
    Materialized.with(Serdes.String(), Serdes.String()));
```

The main difference between a KTable and a GlobalKTable is that a KTable shards data between Kafka Streams instances, while a GlobalKTable extends a full copy of the data to each instance. You typically use a GlobalKTable with lookup data.


## Serialization

Serialization is important for Apache Kafka because as mentioned above, a Kafka broker only works with bytes. Kafka stores records in bytes, and when a fetch request comes in from a consumer, Kafka returns records in bytes. The broker really knows nothing about its records; it just appends them to the end of a file, and that's the end of it.


### Kafka Streams

To bring data into Kafka Streams, you provide SerDes for your topic’s key and value in the Consumed configuration object.

```
StreamsBuilder builder = new StreamsBuilder()
KStream<String, MyObject> stream = builder.stream("topic",
    Consumed.with(Serdes.String(), customObjectSerde)
```
Write out from Kafka Streams, you have to provide a SerDes to serialize your data:
```
KStream<String, CustomObject> modifiedStream = 
    stream.filter( (key, value) -> value.startsWith(“ID5”))               
.mapValues( value -> new CustomObject(value));

modifiedStream.to(“output-topic”, Produced.with(Serdes.String(), customObjectSerde);
```
### Custom SerDes
To create a custom SerDes, use the factory method Serdes.serdeFrom and pass both a serializer instance and a deserializer instance:

```
Serde<T> serde = Serdes.serdeFrom( new CustomSerializer<T>, 
    new CustomDeserializer<T>); 
```

Need to implement the Serializer and Deserializer interfaces from the org.apache.kafka.clients package to create your own serializer and deserializer


### Pre-Existing SerDes
Kafka Streams includes SerDes for String, Integer, Double, Long, Float, Bytes, ByteArray, and ByteBuffer types.


### Avro, Protobuf, or JSON Schema

Depending on whether you are using a specific or generic object, you can use either SpecificAvroSerde or GenericAvroSerde.

SpecificAvroSerde serializes from a specific type, and when you deserialize, you get a specific type back. GenericAvroSerde returns a type-agnostic object, and you access fields in a manner similar to how you retrieve elements from a HashMap.

KafkaProtobufSerde encapsulates a serializer and deserializer for Protobuf-encoded data. It has methods that allow you to retrieve a SerDes as needed.

KafkaJsonSchemaSerde encapsulates a serializer and deserializer for JSON-formatted data. It also has methods that allow you to retrieve a SerDes as needed.


## Joins 

- Kafka Streams offers join operations
- Stream-Stream joins : 
Combine two event streams into a new event stream
Join of events based on a common key
Records arrive within a defined window of time
Possible to compute a new value type
Keys are available in read-only mode can be used in computing the new value

- Stream Table joins : 

KStream KTable
KStream GlobalKTable

- Table Table joins 

### Type Available

- Stream-Stream
Inner - Only if both side are available within the defined window is a joined result emitted
- Outer - Both sides always produce an output record
Left-value + Right value
Left-value + Null
Null + Right value

- Left Outer - The left side always produces an output record
Left-value + Right value
Left-value + Null

### Stream Table

Inner :
An inner join only fires if both sides are available.

Left Outer:
The KStream always produces a record, either a combination of the left and right values, or the left value and a null representing the right side.

GlobalKTable-Stream Join Properties:
With a GlobalKTable, you get full replication of the underlying topic across all instances, as opposed to sharding. GlobalKTable provides a mechanism whereby, when you perform a join with a KStream, the key of the stream doesn't have to match. You get a KeyValueMapper when you define the join, and you can derive the key to match the GlobalKTable key using the stream key and/or value.

Yet another difference between a KTable join and a GlobalKTable join is the fact that a KTable uses timestamps. With a GlobalKTable, when there is an update to the underlying topic, the update is just automatically applied. It's divorced completely from the time mechanism within Kafka Streams. (In contrast, with a KTable, timestamps are part of your event stream processing.) This means that a GlobalKTable is suited for mostly static lookup data. For example, you might use it to hold relatively static user information for matching against transactions.

### Table-Table

join a KTable with a KTable. Note that you can only join a GlobalKTable with a KStream.
 
```
KStream<String, String> leftStream = builder.stream("topic-A");
KStream<String, String> rightStream = builder.stream("topic-B");

ValueJoiner<String, String, String> valueJoiner = (leftValue, rightValue) -> {
    return leftValue + rightValue;
};
leftStream.join(rightStream, 
                valueJoiner, 
                JoinWindows.of(Duration.ofSeconds(10)));
```

The JoinWindows argument, which states that an event on the right side needs to have a timestamp either 10 seconds before the left-stream side or 10 seconds after the left-stream side.










