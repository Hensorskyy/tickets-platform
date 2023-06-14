import { useEffect, useState } from "react";

import { Router } from "next/router";
import StripeCheckout from 'react-stripe-checkout';
import { useRequest } from "../../hooks/useRequst";

const OrderDetails = ({order, currentUser}) => {
    const [timeLeft, setTimeLeft] = useState(0)

    const {doRequest, errors} = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order?.id
        },
        onSuccess: () => Router.push('/orders')
    })

    useEffect(()=>{
        const countTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date() 
            setTimeLeft(Math.round(msLeft / 1000))
        }

        countTimeLeft()
        const timerId = setInterval(countTimeLeft, 1000)
        return () => {
            clearInterval(timerId)
        }
    },[])

    if (timeLeft < 0) {
        return <div>Order Expired</div>
    }
    
    return <div>
        Time left to pay: {timeLeft} seconds
        <StripeCheckout 
            token={(token) => doRequest({tokenId: token.id})}
            stripeKey="pk_test_51NIYu1EZAOgdixSjD01Y6Ck4kvFnb93Nbw1mJYUXEVwt9v0PSyepoW5nDnF9lFDIfo6OKEXDpqb7WGAIendrQMHe00sRu4g5l0"
            currency="USD"
            amount={order.ticket.price * 100}
            email={currentUser.email}
        />
        {errors}
        </div>
}

OrderDetails.getInitialProps = async (context, axiosClient) => {
    const {orderId} = context.query;
    
    const {data} = await axiosClient.get(`/api/orders/${orderId}`)

    return {order: data}
}

export default OrderDetails