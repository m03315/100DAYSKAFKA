# Hands On: Basic Operations

## Create a new cluster

Create a new instance of Basic type, named  kafka_streams_course


### Clients -> Java

- Create Kafka cluster API key.

- Copy your key and secret, name the file, then click Download and continue.

- Create Schema Registry API key

- Copy your key and secret, name the file, then click Download and continue. 

- Create a file named ccloud.properties in the src/main/resources directory of the repo you downloaded. Then paste the configurations into the ccloud.properties file.


## Config project 

go to src/main/resources folder

```
cat streams.properties.orig > streams.properties
cat ccloud.properties >> streams.properties
```

## Code Description 

### properties object 

create a properties object in your BasicStreams.java file:

```
package io.confluent.developer.basic;

import java.io.IOException;
import java.util.Properties;	

public class BasicStreams {
    public static void main(String[] args) throws IOException {
    Properties streamsProps = new Properties();
    }
}
```

### load properties

```
try (FileInputStream fis = new FileInputStream("src/main/resources/streams.properties")) {
    streamsProps.load(fis);
}
streamsProps.put(StreamsConfig.APPLICATION_ID_CONFIG, "basic-streams");
```

### Topics 

Create a StreamsBuilder instance, and retrieve the name of the inputTopic and outputTopic from the Properties:

```
StreamsBuilder builder = new StreamsBuilder()	
final String inputTopic = streamsProps.getProperty("basic.input.topic");
final String outputTopic = streamsProps.getProperty("basic.output.topic");
```

### firstStream

Create an order number variable (you'll see where it comes into play soon), and then create the KStream instance (note the use of the inputTopic variable):

```
final String orderNumberStart = "orderNumber-";
KStream<String, String> firstStream = builder.stream(inputTopic, Consumed.with(Serdes.String(), Serdes.String())); 

```

### peek operator 
Add a peek operator (it's expected that you don't modify the keys and values). Here, it's printing records as they come into the topology:

```
firstStream.peek((key, value) -> System.out.println("Incoming record - key " +key +" value " + value))
```

### Filter

Add a filter to drop records where the value doesn't contain an order number string:

```
.filter((key, value) -> value.contains(orderNumberStart))	
```

### mapValues

Add a mapValues operation to extract the number after the dash:

```
.mapValues(value -> value.substring(value.indexOf("-") + 1))
```

### another Filter
Add another filter to drop records where the value is not greater than 1000:

```
.filter((key, value) -> Long.parseLong(value) > 1000)

```
### Another peek

Add an additional peek method to display the transformed records:

```
.peek((key, value) -> System.out.println("Outgoing record - key " +key +" value " + value))
```

### to Operator
Add the to operator, the processor that writes records to a topic:

```
.to(outputTopic, Produced.with(Serdes.String(), Serdes.String()));
```

### create stream instance

Create the Kafka Streams instance:
```
KafkaStreams kafkaStreams = new KafkaStreams(builder.build(), streamsProps);
```

### utility 
Use the utility method TopicLoader.runProducer() to create the required topics on the cluster and produce some sample records (we’ll see this pattern throughout the exercises, but keep in mind that it's not part of a standard Kafka Streams application):

```
TopicLoader.runProducer();
```


### start the application 

```
kafkaStreams.start();
```


## Run apps with Gradle

```
./gradlew runStreams -Pargs=basic
```


## Hands On: KTable

1. Start by creating a variable to store the string that we want to filter on:

```
final String orderNumberStart = "orderNumber-";
```

2. Now create the KTable instance. Note that you call builder.table instead of builder.stream; also, with the Materialized configuration object, you need to provide a name for the KTable in order for it to be materialized. It will use caching and will only emit the latest records for each key after a commit (which is 30 seconds, or when the cache is full at 10 MB).

```
KTable<String, String> firstKTable = builder.table(inputTopic,
    Materialized.<String, String, KeyValueStore<Bytes, byte[]>>as("ktable-store")
```

3. Add SerDes for the key and value on your Materialized object:

```
.withKeySerde(Serdes.String())
.withValueSerde(Serdes.String()));
```
4. Add a filter operator for removing records that don't contain the order number variable value:

```
firstKTable.filter((key, value) -> value.contains(orderNumberStart))
```

5. Map the values by taking a substring:
```
.mapValues(value -> value.substring(value.indexOf("-") + 1))
```

6. Then filter again by taking out records where the number value of the string is less than or equal to 1000:

```
.filter((key, value) -> Long.parseLong(value) > 1000)
```

7. Convert the KTable to a KStream:

```
.toStream()
```

8. Add a peek operation to view the key values from the table:

```
.peek((key, value) -> System.out.println("Outgoing record - key " +key +" value " + value))
```

9. Write the records to a topic:

```
.to(outputTopic, Produced.with(Serdes.String(), Serdes.String()));
```

10. Create a KafkaStreams object and run the topic data helper utility:
```
KafkaStreams kafkaStreams = new KafkaStreams(builder.build(), streamsProps);
TopicLoader.runProducer();
```
11. Finally, start the application:

```
kafkaStreams.start();
```

Now you can run the KTable example with this command:

```
./gradlew runStreams -Pargs=ktable 
```

## Hands On: Joins

Use a static helper method to get SerDes for your Avro records (in subsequent exercises, you'll abstract this into a static utility method, in the StreamsUtils class of the course repo):

```
static <T extends SpecificRecord> SpecificAvroSerde<T> getSpecificAvroSerde(Map<String, Object> serdeConfig) {
    SpecificAvroSerde<T> specificAvroSerde = new SpecificAvroSerde<>();
    specificAvroSerde.configure(serdeConfig, false);
    return specificAvroSerde;
}
```
Use a utility method to load the properties (you can refer to the StreamsUtils class within the exercise source code):

```
Properties streamsProps = StreamsUtils.loadProperties();
```
Get the input topic names and the output topic name from the properties:

```
String streamOneInput = streamsProps.getProperty("stream_one.input.topic");
String streamTwoInput = streamsProps.getProperty("stream_two.input.topic");
String tableInput = streamsProps.getProperty("table.input.topic");
String outputTopic = streamsProps.getProperty("joins.output.topic");
```

Create a HashMap of the configurations:

```
Map<String, Object> configMap = StreamsUtils.propertiesToMap(streamsProps);
```
Then create the required SerDes for all streams and for the table:

```
SpecificAvroSerde<ApplianceOrder> applianceSerde = getSpecificAvroSerde(configMap);
SpecificAvroSerde<ElectronicOrder> electronicSerde = getSpecificAvroSerde(configMap);
SpecificAvroSerde<CombinedOrder> combinedSerde = getSpecificAvroSerde(configMap);
SpecificAvroSerde<User> userSerde = getSpecificAvroSerde(configMap);
```
Create the ValueJoiner for the stream-table join:

```
ValueJoiner<ApplianceOrder, ElectronicOrder, CombinedOrder> orderJoiner =
    (applianceOrder, electronicOrder) -> CombinedOrder.newBuilder()
        .setApplianceOrderId(applianceOrder.getOrderId())
        .setApplianceId(applianceOrder.getApplianceId())
        .setElectronicOrderId(electronicOrder.getOrderId())
        .setTime(Instant.now().toEpochMilli())
        .build();
```

Create the ApplianceOrder stream as well as the ElectronicOrder stream:

```
KStream<String, ApplianceOrder> applianceStream =
    builder.stream(streamOneInput, Consumed.with(Serdes.String(), applianceSerde))
        .peek((key, value) -> System.out.println("Appliance stream incoming record key " + key + " value " + value));

KStream<String, ElectronicOrder> electronicStream =
    builder.stream(streamTwoInput, Consumed.with(Serdes.String(), electronicSerde))
        .peek((key, value) -> System.out.println("Electronic stream incoming record " + key + " value " + value));
```
From here, create the User table:

```
KTable<String, User> userTable = builder.table(tableInput, Materialized.with(Serdes.String(), userSerde));
```
Now create the stream-stream join and call the join method on the applianceStream, the left side (or primary) stream in the join. Add the electronicStream as the right side (or secondary) stream in the join, and add the orderJoiner created before:

```
KStream<String, CombinedOrder> combinedStream =
      applianceStream.join(
            electronicStream,
            orderJoiner,
```

Specify a JoinWindows configuration of 30 minutes (a right-side record must have timestamps within 30 minutes before or after the timestamp of the left side for a join result to occur):

```
JoinWindows.of(Duration.ofMinutes(30)),
```

Add the StreamJoined configuration with SerDes for the key, left-side, and right-side objects, for the joined state stores:

```
StreamJoined.with(Serdes.String(), applianceSerde, electronicSerde))
```
Add a peek operator to view the results of the join:

```
.peek((key, value) -> System.out.println("Stream-Stream Join record key " + key + " value " + value));
```
Call the join method on the KStream that results from the join in previous steps, adding the userTable as the right side in the stream-table join. Then add enrichmentJoiner to add user information, if available. Add the Joined object with SerDes for the values of both sides of the join, add the peek operator to view the stream-table join results, and write the final join results to a topic:

```
combinedStream.leftJoin(
                userTable,
                enrichmentJoiner,
                Joined.with(Serdes.String(), combinedSerde, userSerde))
    .peek((key, value) -> System.out.println("Stream-Table Join record key " + key + " value " + value))
    .to(outputTopic, Produced.with(Serdes.String(), combinedSerde));
```

Create the KafkaStreams object, and again use the TopicLoader helper class to create topics and produce exercise data:

```
KafkaStreams kafkaStreams = new KafkaStreams(builder.build(), streamsProps);
TopicLoader.runProducer();
```

Finally, start the Kafka Streams application:

```
kafkaStreams.start();
```
You run the joins example with this command:

```
./gradlew runStreams -Pargs=joins
```

