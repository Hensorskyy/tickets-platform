const OrderList = ({orders}) => {
    return <ul>
        {orders?.map(order => {
            return <li>
                {order.ticket.title} - {order.status} 
            </li>
        })}
    </ul>
}

OrderList.getInitialProps = async (context, axiosClient) => {
    const {data} = await axiosClient.get('/api/orders')

    return {orders: data}
}

export default OrderList;