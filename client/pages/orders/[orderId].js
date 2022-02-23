import { useEffect, useState} from 'react';
import StripeCheckout from 'react-stripe-checkout'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

const OrderShow = ({order, currentUser}) =>{
    const [timeLeft, setTimeLeft] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push('/orders')
    });

    useEffect(() =>{
        const findTimeLeft = () =>{
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        }
    }, [order])
    
    if( timeLeft < 0){
        return <div>Order expires!</div>
    }
    
    return <div> 
        {timeLeft} seconds until order expires!
        <StripeCheckout 
            token={({id}) => doRequest({token: id})}
            stripeKey="pk_test_51KVYQFCtE6QdGTc5IqMf7y1nNtQj7FO65mbuIgyxFj4QFbz6UmVlnGOOOVQ3dqoT5J0ur6WRpgVvySV6ev4BdoVk00o55EZZiV"
            amount={order.ticket.price * 100}
            email={currentUser.email}
        />
        {errors}
        </div>
}


OrderShow.getInitialProps = async ( context, client) => {
    const {orderId} = context.query;
    const {data} = await client.get(`/api/orders/${orderId}`);
    return {order: data}
}
export default OrderShow;