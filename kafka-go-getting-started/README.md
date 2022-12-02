




















































































# GO

## Install GO 

```
wget https://go.dev/dl/go1.19.3.linux-amd64.tar.gz
```


### Remove previous GO version and install a new one

```
sudo rm -rf /usr/local/go && tar -xvf go1.19.3.linux-amd64.tar.gz -C /usr/local
```

### Add /usr/local/go/bin to the PATH environment variable
```
export PATH=$PATH:/usr/local/go/bin
```

### Check if install OK

```
go version
```

## Initialize the Go module and download the Confluent Go Kafka dependency

```
go mod init kafka-go-getting-started
go get github.com/confluentinc/confluent-kafka-go/kafka
```



## Configuration

rename getting-started-template.properties to getting-started.properties


replace below values by yours 
- bootstrap.servers
- sasl.username
- sasl.password

## Create a topic

create a topic named purchases

## Build a Producer

a file named util.go will help to load configuration file for the go application

producer.go file is the producer application code


### compile the producer

```
go build -o out/producer util.go producer.go
```
## Build a Consumer

consumer.go file is the consumer application code 

### compile the consumer

```
go build -o out/consumer util.go consumer.go
```

## Produce events 

```
./out/producer getting-started.properties
```

## Consumer events 

```
./out/consumer getting-started.properties 
```


