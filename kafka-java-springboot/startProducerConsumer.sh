#!/bin/bash

RED='\033[0;31m'
NC='\033[0m' # No Color
GREEN='\033[0;32m'
BLUE='\033[0;34m'

# including some common utilities (`ccloud::validate_ccloud_config`, `ccloud::validate_schema_registry_up`, etc)
source ccloud_library.sh

echo -e "\n${BLUE}\t☁️  Generating a config from Confluent Cloud properties... ${NC}\n"

export CONFIG_FILE=~/java.config
ccloud::validate_ccloud_config $CONFIG_FILE || exit

./ccloud-generate-cp-configs.sh $CONFIG_FILE

DELTA_CONFIGS_DIR=delta_configs
source $DELTA_CONFIGS_DIR/env.delta

ccloud::validate_schema_registry_up $SCHEMA_REGISTRY_BASIC_AUTH_USER_INFO $SCHEMA_REGISTRY_URL || exit 1


echo -e "\n${BLUE}\t🍃  Building Spring Boot application... ${NC}"

./gradlew build

echo -e "${GREEN}\t🍃  Starting Spring Boot application (spring-kafka API)... ${NC}"

java -cp build/libs/java-springboot-0.0.1-SNAPSHOT.jar -Dloader.main=io.confluent.examples.clients.cloud.springboot.kafka.SpringbootKafkaApplication org.springframework.boot.loader.PropertiesLauncher 
