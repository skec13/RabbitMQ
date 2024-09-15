//receiving messages from the broker
const amqplib = require('amqplib');

const queueName = "hello";

const receiveMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();
  //create a queue if it is not already
  await channel.assertQueue(queueName, {durable: false});
  console.log(`Waiting for ${queueName} queues...`);
  //receive the message and send back an acknowledgement
  channel.consume(queueName, msg => {
    console.log("[X] Received:", msg.content.toString());
  }, {noAck:true});

}

receiveMsg();
