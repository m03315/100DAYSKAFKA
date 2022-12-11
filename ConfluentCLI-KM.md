# Confluent CLI knowledge Management


## switch envionment with CLI 


available environment list : 

```
confluent environment list
```

choose one environement
```
confluent environment use <env id>0
```

## Switch Cluster with CLI


get all clusters in current environment
```
confluent kafka cluster list
```

```
confluent kafka cluster use <cluster id>
```


## API Key configuration


- create new API KEY in confluent console

get key and secret informations from download file

```
confluent api-key store --resource <cluster id>
```

- create a new one in the terminal with CLI


## Create a schema for your records 

a file named **orders-avro-schema.json** 

```
{
"type": "record",
"namespace": "io.confluent.tutorial",
"name": "OrderDetail",
"fields": [
    {"name": "number", "type": "long", "doc": "The order number."},
    {"name": "date", "type": "long", "logicalType": "date", "doc": "The date the order was submitted."},
    {"name": "shipping_address", "type": "string", "doc": "The shipping address."},
    {"name": "subtotal", "type": "double", "doc": "The amount without shipping cost and tax."},
    {"name": "shipping_cost", "type": "double", "doc": "The shipping cost."},
    {"name": "tax", "type": "double", "doc": "The applicable tax."},
    {"name": "grand_total", "type": "double", "doc": "The order grand total ."}
    ]
}
```


## Create a topic 

- normal example:

```
confluent kafka topic create orders --partitions 1

```

- Schema Registry example:
```
confluent kafka topic create orders-avro --partitions 1
```


## Produce and consume messages 


### Produce and consume message by default 

```
confluent kafka topic produce orders

confluent kafka topic consume orders
```


### Produce and consume records with full key-value paris 

```
confluent kafka topic produce orders --parse-key --delimiter ":"

confluent kafka topic consume orders --print-key --delimiter "-" --from-beginning

```

An example : 

```
6:{"number":6,"date":18505,"shipping_address":"9182 Shipyard Drive, Raleigh, NC. 27609","subtotal":72.00,"tax":3.00,"grand_total":75.00,"shipping_cost":0.00}
7:{"number":7,"date":18506,"shipping_address":"644 Lagon Street, Chicago, IL. 07712","subtotal":11.00,"tax":1.00,"grand_total":14.00,"shipping_cost":2.00}
```

### Produce events to Kafka topic with Schema Registry: 

```
confluent kafka topic produce orders-avro --value-format avro --schema orders-avro-schema.json
```

Test data :
```
{"number":1,"date":18500,"shipping_address":"ABC Sesame Street,Wichita, KS. 12345","subtotal":110.00,"tax":10.00,"grand_total":120.00,"shipping_cost":0.00}
{"number":2,"date":18501,"shipping_address":"123 Cross Street,Irving, CA. 12345","subtotal":5.00,"tax":0.53,"grand_total":6.53,"shipping_cost":1.00}
{"number":3,"date":18502,"shipping_address":"5014  Pinnickinick Street, Portland, WA. 97205","subtotal":93.45,"tax":9.34,"grand_total":102.79,"shipping_cost":0.00}
{"number":4,"date":18503,"shipping_address":"4082 Elmwood Avenue, Tempe, AX. 85281","subtotal":50.00,"tax":1.00,"grand_total":51.00,"shipping_cost":0.00}
{"number":5,"date":18504,"shipping_address":"123 Cross Street,Irving, CA. 12345","subtotal":33.00,"tax":3.33,"grand_total":38.33,"shipping_cost":2.00}

```

Produce records with full key-value pairs

```
confluent kafka topic produce orders-avro --value-format avro --schema orders-avro-schema.json --parse-key --delimiter ":"

```

Sample data: 

```
6:{"number":6,"date":18505,"shipping_address":"9182 Shipyard Drive, Raleigh, NC. 27609","subtotal":72.00,"tax":3.00,"grand_total":75.00,"shipping_cost":0.00}
7:{"number":7,"date":18506,"shipping_address":"644 Lagon Street, Chicago, IL. 07712","subtotal":11.00,"tax":1.00,"grand_total":14.00,"shipping_cost":2.00}

```

## Consume with full key-value pairs


```
confluent kafka topic consume orders-avro --value-format avro --print-key --delimiter "-"  --from-beginning
```

## Get Schema Registry API informations: 

Environement -> Credentials (right side menu) -> Add new key 




