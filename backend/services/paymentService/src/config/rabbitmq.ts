import amqplib,{Connection,Channel} from 'amqplib'

let connection:Connection
let channel:Channel


export const rabbitmqConnect = async()=>{
    try {
        connection = await amqplib.connect('amqp://rabbitmq:5672')
        channel = await connection.createChannel()
        console.log('connected to rabbtimq in userService');
        
    } catch (error) {
        console.error('Failed to connect to rabbitmq',error);
    }
}


export const getChannel = (): Channel => channel;