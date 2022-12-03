# .NET


## Install .NET CORE

install [.net core >= 6.0](https://dotnet.microsoft.com/download)

## configuration 

rename [getting-started-template.properties](getting-started-template.properties) to getting-started.properties


replace following values by yours :
- bootstrap.servers
- sasl.username
- sasl.password


## Build Producer 

create a project file [producer.csproj](producer/producer.csproj)

create producer application file [producer.cs](producer/producer.cs)

compile application file :

```
cd producer
dotnet build producer.csproj
```


## Build Consumer

create a project file [consumer.csproj](consumer/consumer.csproj)

create consumer application file [consumer.cs](consumer/consumer.cs)

compile application file :

```
cd ../consumer
dotnet build consumer.csproj
cd ..
```

## Produce Events

```
cd producer
dotnet run $(pwd)/../getting-started.properties
```

## Consume Events

```
cd consumer
dotnet run $(pwd)/../getting-started.properties
```
