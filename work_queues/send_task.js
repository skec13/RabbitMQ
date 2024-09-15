//sending message to the broker/queue
const amqplib = require('amqplib');

const queueName = "task";
const msg = process.argv.slice(2).join(' ') || "hello world";   //user input

const sendMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();
  //create a queue
  await channel.assertQueue(queueName, {durable: true});
  //send to queue, make msg stay persistent
  channel.sendToQueue(queueName, Buffer.from(msg), {persistent: true});
  console.log(msg);
  //close the connection
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

sendMsg();
