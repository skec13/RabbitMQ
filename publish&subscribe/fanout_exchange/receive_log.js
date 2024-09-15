//consume msg from the queue
const amqplib = require('amqplib');

const exchangeName = "logs";

const receiveMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();
  //create a exchange if it is not already
  await channel.assertExchange(exchangeName, 'fanout', {durable: false});
  //create a queue and delete it automatically once finished
  const q = await channel.assertQueue('', {exclusive: true});
  console.log(`Waiting for message in queue: ${q.queue}`);
  //bind queue to exchange
  channel.bindQueue(q.queue, exchangeName, '');   //(which queue, which exchange, routing) -> routing is empty because we use fanout
  channel.consume(q.queue, msg => {
    if(msg.content) console.log("The message is: ", msg.content.toString());
  }, {noAck:true});

}

receiveMsg();
