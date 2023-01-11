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




