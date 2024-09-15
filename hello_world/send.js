//sending message to the broker/queue
const amqplib = require('amqplib');

const queueName = "hello";
const msg = "hello world";

const sendMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();
  //create a queue, durable for restarting the instance if exited
  await channel.assertQueue(queueName, {durable: false});
  //send to queue
  channel.sendToQueue(queueName, Buffer.from(msg));
  console.log(msg);
  //close the connection
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

sendMsg();
