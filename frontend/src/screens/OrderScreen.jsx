import {Link, useParams} from 'react-router-dom'
import {Row, Col, ListGroup, Image, Form, Button, Card, } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useGetOrderDetailsQuery } from '../slices/ordersApiSlice'
import { useSelector, useDispatch } from 'react-redux'

const OrderScreen = () => {
    const {id: orderId} = useParams();
    const {userInfo} = useSelector((state) => state.auth)

    const { data: order, refetch, isLoading, error}= useGetOrderDetailsQuery(orderId)

    if(isLoading){
        return <Loader />
    }
    if(error){
        return <Message variant='danger'>{error.data?.Message}</Message>
    }

    
  return  (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}></Col>
      </Row>
    </>
  );

}

export default OrderScreen