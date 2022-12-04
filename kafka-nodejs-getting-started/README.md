# Node.js


## Install prerequisites

install [node.js 16.3.1](https://nodejs.org/en/download/)

install required kafka libraries: 

```
npm i node-rdkafka
```

## configuration 

rename [getting-started-template.properties](getting-started-template.properties) to getting-started.properties


replace following values by yours :
- bootstrap.servers
- sasl.username
- sasl.password


## Build Producer 

- create a utility script file [util.js](util.js)

- create producer application file [producer.js](producer.js)


## Build Consumer

- create consumer application file [consumer.js](consumer.js)

## Produce Events

```
node producer.js getting-started.properties
```

## Consume Events

```
node consumer.js getting-started.properties
```
