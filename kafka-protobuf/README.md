# Protobuf in Confluent Cloud

## Enabling Schema Registry

- Choose one cluster
- Click Schemas
- Click Enable Schema Registry

You must specify which cloud provider will run the software and in which region. It is important to note that the region should be as close as possible to the applications that will write and read records to and from Kafka.


Enabling managed Schema Registry using Confluent Cloud CLI
```
ccloud schema-registry cluster enable --cloud <CLOUD_PROVIDER> --geo <REGION>
```


## Sensor readings using Protobuf

In Protobuf, we can define this data model using [messages](https://developers.google.com/protocol-buffers/docs/proto3#simple)
```
syntax = "proto3";
package io.confluent.cloud.demo.domain;
option java_outer_classname = "SensorReadingImpl";

message SensorReading {
   message Device {
      string deviceID = 1;
      bool enabled = 2;
   }
```

The option java_outer_classname indicates the name of the Java class that will contain the implementation of both Device and SensorReading messages.

To generate a class, we need to use a [Protobuf compiler](https://github.com/protocolbuffers/protobuf) or a maven plugin [protoc-jar-maven-plugin](https://github.com/os72/protoc-jar-maven-plugin) that automates the generation of the client code.

```
<plugin>
  <groupId>com.github.os72</groupId>
  <artifactId>protoc-jar-maven-plugin</artifactId>
  <version>3.11.4</version>
  <executions>
    <execution>
      <phase>generate-sources</phase>
      <goals>
        <goal>run</goal>
      </goals>
      <configuration>
        <inputDirectories>
          <include>src/main/resources/</include>
        </inputDirectories>
        <outputTargets>
          <outputTarget>
            <type>java</type>
            <addSources>none</addSources>
            <outputDirectory>src/main/java/</outputDirectory>
          </outputTarget>
        </outputTargets>
      </configuration>
    </execution>
  </executions>
</plugin>
```

If you invoke the Maven compile phase on your project, then the plugin will compile the Protobuf file and generate a file named SensorReadingImpl.java in the folder src/main/java. In this file, there will be Device and SensorReading messages that you need to start implementing on your producers and consumers, which is going to be covered in the next sections.


## Writing a Kafka producer application

some codes to load config files

```
private static Properties configs = new Properties();

static {
    try {
        try (InputStream is = KafkaUtils.class.getResourceAsStream("/ccloud.properties")) {
            configs.load(is);
        }
    } catch (IOException ioe) {
    }
}

public static Properties getConfigs() {
    return configs;
}

```

In order to do this, you need to append the client configuration with the serialization strategy:
```
// Load from the 'ccloud.properties'
Properties configs = getConfigs();
// Append the serialization strategy
configs.setProperty(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
org.apache.kafka.common.serialization.StringSerializer.class.getName());
configs.setProperty(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
io.confluent.kafka.serializers.protobuf.KafkaProtobufSerializer.class.getName());
```

With the serialization strategy in place, you can implement the code that creates sensor readings and write them in a Kafka topic:
```
try (KafkaProducer<String, SensorReading> producer = new KafkaProducer<>(configs)) {
   Device device = DEVICES.get(index);
   String recordKey = device.getDeviceID();
   ProducerRecord<String, SensorReading> record =
      new ProducerRecord<>("SensorReading", recordKey,
         SensorReading.newBuilder()
            .setDevice(device)
            .setDateTime(new Date().getTime())
            .setReading(RANDOM.nextDouble())
            .build());
   producer.send(record, (metadata, exception) -> {
      System.out.println(String.format(
         "Reading sent to partition %d with offset %d",
         metadata.partition(), metadata.offset()));
   });
}

```

## Writing a Kafka consumer application

```
// Load from the 'ccloud.properties'
Properties configs = getConfigs();
```

```
configs.setProperty(KafkaProtobufDeserializerConfig.SPECIFIC_PROTOBUF_VALUE_TYPE,
   SensorReading.class.getName());
```

Finally, the consumer needs to set which consumer group it will belong to so Kafka knows how to fetch records from the partitions and deliver to this consumer. This is achieved by specifying the property group.id.

```
configs.setProperty(ConsumerConfig.GROUP_ID_CONFIG, ConsumerApp.class.getName());
```

You can now implement the code that reads the sensor readings from the Kafka topic. The code itself doesn’t look too complicated thanks to the deserializer that does the heavy lifting of reading the bytes from the record’s value and transforming the group into the desired Java class.


```
try (KafkaConsumer<String, SensorReading> consumer = new KafkaConsumer<>(configs)) {
   consumer.subscribe(Arrays.asList("SensorReading"));
   ConsumerRecords<String, SensorReading> records =
      consumer.poll(Duration.ofSeconds(Integer.MAX_VALUE));
   for (ConsumerRecord<String, SensorReading> record : records) {
      SensorReading sensorReading = record.value();
      Device device = sensorReading.getDevice();
      StringBuilder sb = new StringBuilder();
      sb.append("deviceID.....: ").append(device.getDeviceID()).append("\n");
      sb.append("enabled......: ").append(device.getEnabled()).append("\n");
      sb.append("dateTime.....: ").append(sensorReading.getDateTime()).append("\n");
      sb.append("reading......: ").append(sensorReading.getReading()).append("\n");
      System.out.println(sb.toString());
   }
}
```

## Schema lifecycle management

```
<plugin>
  <groupId>io.confluent</groupId>
  <artifactId>kafka-schema-registry-maven-plugin</artifactId>
  <version>5.5.0</version>
  <configuration>
      <schemaRegistryUrls>
          <param>${schema.registry.url}</param>
      </schemaRegistryUrls>      
      <userInfoConfig>${schema.registry.basic.auth.user.info}</userInfoConfig>
      <outputDirectory>schemas</outputDirectory>
      <subjectPatterns>
          <param>^SensorReading-(value)$</param>
      </subjectPatterns>
      <schemaExtension>.proto</schemaExtension>
  </configuration>
</plugin>
```
In order for the plugin to communicate with the managed Schema Registry, you need to provide values for the properties schemaRegistryUrls and userInfoConfig that control how the plugin will connect and authenticate with Confluent Cloud, respectively. To specify which schemas to download, provide one or multiple entries for the property subjectPatterns. This property accepts a regular expression that can be used to specify the schemas. Once you have everything set, you can execute the Maven plugin by running the following command:

```
mvn schema-registry:download
```

## Working with Protobuf in ksqlDB

Support for Protobuf is also available for ksqlDB; therefore, developers interested in creating event streaming applications using ksqlDB can leverage this too. In this case, we will reuse the same data that was sent to the SensorReading topic and transform it into a stream that can be queried and subsequently transformed into a table.


Once the ksqlDB application is created, there will also be a new service account created that has full access to the cluster. However, this service account needs to be configured regarding reading and writing permissions to topics, and you need to set up some Kafka ACLs to allow for that.

```
ccloud kafka acl create --allow --service-account <SERVICE_ACCOUNT_ID> --operation READ --topic SensorReading
```

After creating the stream, you can execute push queries to verify if data is coming from the producer application. Execute the query SELECT * FROM SensorReading EMIT CHANGES; 


