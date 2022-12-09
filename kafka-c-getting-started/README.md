# Apache Kafka C/C++


## install perequisites


install gcc
```
sudo apt-get install gcc
```

install [librdkafka](https://github.com/edenhill/librdkafka)

```
sudo apt-get install librdkafka
```

install [pkg-config](https://www.freedesktop.org/wiki/Software/pkg-config/) 

```
sudo apt-get install pkg-config
```

install [glib](https://www.gnu.org/software/libc/)

```
sudo apt-get install -y libglib2.0-dev
```

## Create project 

create a new [Makefile](Makefile)


create a common c file will be usded by producer and consumer [common.c](common.c)

## Configuration 

rename config file [getting_started-template.ini](getting_started-template.ini) to getting_started.ini

replace below values with yours:

- bootstrap.servers
- CLUSTER API KEY
- cluster API SECRET

## Build Producer 

create a producer file [producer.c](producer.c)

## Build Consumer

create a consumer file [consumer.c](consumer.c)


## Produce Events 

Compile producer file
```
make producer 
```

Run producer program with config file 

```
./producer getting-started.ini
```

## Consume Events 

Compile consumer file 

```
make consumer
```

Run consumer program with config file 

```
./consumer getting-started.ini
```

