const Kafka = require('node-rdkafka');
const { configFromPath } = require('./util');

function createConfigMap(config) {
  if (config.hasOwnProperty('security.protocol')) {
    return {
      'bootstrap.servers': config['bootstrap.servers'],
      'sasl.username': config['sasl.username'],
      'sasl.password': config['sasl.password'],
      'security.protocol': config['security.protocol'],
      'sasl.mechanisms': config['sasl.mechanisms'],
      'dr_msg_cb': true }
  } else {
    return {
      'bootstrap.servers': config['bootstrap.servers'],
      'dr_msg_cb': true
    }
  }
}

function createProducer(config, onDeliveryReport) {

  const producer = new Kafka.Producer(createConfigMap(config));

  return new Promise((resolve, reject) => {
    producer
      .on('ready', () => resolve(producer))
      .on('delivery-report', onDeliveryReport)
      .on('event.error', (err) => {
        console.warn('event.error', err);
        reject(err);
      });
    producer.connect();
  });
}

async function produceExample() {
  if (process.argv.legth < 3) {
    console.log("Please provide the configuration file path as the command line argument");
    process.exit(1);
  }
  let configPath = process.argv.slice(2)[0];
  const config = await configFromPath(configPath);

  let topic = "purchases";

  let users = [ "eabara", "jsmith", "sgarcia", "jbernard", "htanaka", "awalther" ];
  let items = [ "book", "alarm clock", "t-shirts", "gift card", "batteries" ];

  const producer = await createProducer(config, (err, report) => {
    if (err) {
      console.warn('Error producing', err)
    } else {
      const {topic, key, value} = report;
      let k = key.toString().padEnd(10, ' ');
      console.log(`Produced event to topic ${topic}: key = ${k} value = ${value}`);
    }
  });

  let numEvents = 10;
  for (let idx = 0; idx < numEvents; ++idx) {

    const key = users[Math.floor(Math.random() * users.length)];
    const value = Buffer.from(items[Math.floor(Math.random() * items.length)]);

    producer.produce(topic, -1, value, key);
  }

  producer.flush(10000, () => {
    producer.disconnect();
  });
}

produceExample()
  .catch((err) => {
    console.error(`Something went wrong:\n${err}`);
    process.exit(1);
  });
