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