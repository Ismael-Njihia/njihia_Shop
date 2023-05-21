import {Link, useParams} from 'react-router-dom'
import {Row, Col, ListGroup, Image, Form, Button, Card, } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useGetOrderDetailsQuery } from '../slices/ordersApiSlice'

const OrderScreen = () => {
    const {id: orderId} = useParams();

    const {data: order, refetch, isLoading, error} = useGetOrderDetailsQuery(orderId)

  return (
    
      isLoading ? (<Loader />)
       :error ? (<Message variant='danger'>{error}</Message>)

        :(<> 
        <h1>Order </h1>
        </>)
   
  )
 
        
     
  

}

export default OrderScreen