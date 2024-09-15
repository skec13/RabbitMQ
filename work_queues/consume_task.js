//receiving messages from the broker
const amqplib = require('amqplib');

const queueName = "task";

const consumeMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();
  //create a queue if it is not already
  await channel.assertQueue(queueName, {durable: true});
  console.log(`Waiting for ${queueName} queues...`);
  //for fait dispatch
  channel.prefetch(1);
  //receive the message and send back an acknowledgement
  channel.consume(queueName, msg => {
    //simulate time-consuming task based on users input
    const secs = msg.content.toString().split('.').length - 1;
    console.log("[X] Received:", msg.content.toString());
    //simulate the consuming task
    setTimeout(() => {
      console.log("Consuming time");
      channel.ack(msg);   //custom acknowledgement of a message
    }, secs * 1000);
  }, {noAck:false});   //ack false because we will manually rend a message back

}

consumeMsg();

/*
run two separate consume_task instances
send message with: node send_task.js test.
send another message with: node send_task.js test..
send another message with: node send_task.js test...
rabbitMQ will spread the tasks between services(Round-robin dispatching)
First consumer will have test. and test...
Second consumer will have test..
*/
