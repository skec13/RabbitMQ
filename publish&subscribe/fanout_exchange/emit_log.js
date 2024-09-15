//sending message to the exchange which will send msg to the queue
const amqplib = require('amqplib');

const exchangeName = "logs";
const msg = process.argv.slice(2).join(' ') || "hello world";   //simulate time consuming task

const sendMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();
  //fanout exchange
  await channel.assertExchange(exchangeName, 'fanout', {durable: false});
  //send to exchange, '' means to every queue
  channel.publish(exchangeName, '', Buffer.from(msg));
  console.log(msg);
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

sendMsg();
