import { natsWrapper } from '../nat-wrapper';


if (!process.env.NATS_CLUSTER_ID){
    throw new Error('Missing JWT_KEY');
}

if (!process.env.NATS_CLIENT_ID){
    throw new Error ('Missing NATS_CLIENT_ID');
}

if (!process.env.NATS_URL){
    throw new Error('Missing NATS_URL');
}

if (!process.env.NATS_CLUSTER_ID){
    throw new Error('Missing NATS_CLUSTER_ID');
}

const natsConnect = async () => {
    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID!,
            process.env.NATS_CLIENT_ID!,
            process.env.NATS_URL!);
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        })
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        
    } catch (err){
        console.log(err);
    }
}
natsConnect();
