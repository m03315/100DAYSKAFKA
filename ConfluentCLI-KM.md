# Confluent CLI knowledge Management


## Create a topic 

```
confluent kafka topic create orders --partitions 1

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




