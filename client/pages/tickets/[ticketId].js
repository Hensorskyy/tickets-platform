import Router from 'next/router'
import { useRequest } from "../../hooks/useRequst";

const TicketDetails = ({ticket}) => {
    
    const {doRequest, errors} = useRequest({
        url: '/api/orders/',
        method: 'post',
        body: {ticketId: ticket?.id},
        onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order?.id}`)
    })

    return <div>
            <h1>Ticket Details</h1>
            <h4>{ticket?.title}</h4>
            <h4>{ticket?.price}</h4>
            {errors}
            <button className="btn btn-primary" onClick={() => doRequest()}>Buy now</button>
        </div>
}

TicketDetails.getInitialProps = async (context, axiosClient) => {
    const {ticketId} = context.query;
    
    const {data} = await axiosClient.get(`/api/tickets/${ticketId}`)

    return {ticket: data}
}

export default TicketDetails