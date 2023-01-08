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




