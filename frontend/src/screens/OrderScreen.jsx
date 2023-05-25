import { useEffect } from 'react'
import {Link, useParams} from 'react-router-dom'
import {Row, Col, ListGroup, Image, Form, Button, Card, ListGroupItem, } from 'react-bootstrap'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useGetOrderDetailsQuery, 
  usePayOrderMutation, 
  useGetPayPalClientIdQuery,
useDeliverOrderMutation } from '../slices/ordersApiSlice'
import { useSelector, useDispatch } from 'react-redux'
import {toast} from 'react-toastify'

const OrderScreen = () => {
    const {id: orderId} = useParams();
    

    const { data: order, refetch, isLoading, error}= useGetOrderDetailsQuery(orderId)


    const [payOrder, {isLoading: isLoadingPay, error: errorPay}] = usePayOrderMutation()


    const [deliverOrder, {isLoading: loadingDeliver }] = useDeliverOrderMutation();

    const [{isPending}, paypalDispatch] = usePayPalScriptReducer()
    const {data: paypal, isLoading: loadingPayPal, error: errorPayPal} = useGetPayPalClientIdQuery()
      
    const {userInfo} = useSelector((state) => state.auth)

    useEffect(()=>{
        if(!errorPayPal && !loadingPayPal && paypal.clientId){
          const loadPayPalScript = async () => {
            paypalDispatch({
              type: 'resetOptions',
              value: {
                'client-id': paypal.clientId,
                currency: 'USD',
              }
            })
            paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
          }
          if(order && !order.isPaid){
            if(!window.paypal){
            loadPayPalScript()
            }
          }
        }
    }, [paypal, loadingPayPal, errorPayPal, paypalDispatch, order])


    function onApprove(data, actions){
      return actions.order.capture().then( async function(details){
       try{
        await payOrder({orderId, paymentResult: details})
        refetch()
        toast.success('Payment Successful')

       }catch(error){
        toast.error(error.data?.Message || error.message)
         console.log(error)
       }
      })


    }
    function onError(error){
      toast.error(error.data?.Message || error.message)
      console.log(error)

    }
    function createOrder(data, actions){
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice
            }
          }
        ]
      }).then((orderId) => {
        return orderId
      })

    }
    const onApproveText = async () => {
      await payOrder({orderId, details: { payer: {} }})
        refetch()
        toast.success('Payment Successful')
    }

    const deliverOrderHandler = async () =>{
      try{
        await deliverOrder(orderId);
        refetch()
        toast.success('Order Delivered')

      }catch(error){
        toast.error(error.data?.Message || error.message)
        console.log(error)
      }
      
    }
   
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
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>

              <p>
                <strong>Email: </strong>
                {order.user.email}
              </p>
              <strong>Adress: </strong>
             P.O BOX {order.shippingAddress.address}-{order.shippingAddress.city}, {order.shippingAddress.country}
             
              <p>
                {order.isDelivered ? (
                    <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                ):(
                    <Message variant='danger'>Not Delivered</Message>
                )
                }

              </p>
            </ListGroup.Item>

            <ListGroup.Item >
              <h2>Payment Method</h2>
              
                <p>
                  <strong>Method: </strong>
                  {order.paymentMethod}
                </p>

                <p>
                {order.isPaid ? (
                    <Message variant='success'>Paid on {order.paidAt}</Message>
                ):(
                    <Message variant='danger'>Not Paid</Message>
                )
                }

              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>

              {order.orderItems.length === 0 ? (
                <Message variant='danger'>Order is empty</Message>
              ):(
                order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                        <Row>
                            <Col md={1}>
                                <Image src={item.image} alt={item.name} fluid rounded/>
                            </Col>
                            <Col>
                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                            </Col>
                            <Col md={4}> 
                            {item.qty} x ${item.price} = ${item.qty * item.price}
                            
                            </Col>

                        </Row>
                    </ListGroup.Item>
                
                ))
              )}

            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
            <Card>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                       <h2> Order Summary</h2>
                      </ListGroup.Item>

                      <ListGroup.Item>
                          <Row>
                              <Col>Items</Col>
                              <Col>${order.itemsPrice}</Col>
                            </Row> 

                            <Row>
                              <Col>Shipping Price</Col>
                              <Col>${order.shippingPrice}</Col>
                            </Row>

                            <Row>
                              <Col>Tax</Col>
                              <Col>${order.taxPrice}</Col>
                            </Row> 

                            <Row>
                              <Col>Total</Col>
                              <Col>${order.totalPrice}</Col>
                            </Row>  
                      </ListGroup.Item>

                      {
                        !order.isPaid && (
                          <ListGroup.Item>
                            

                            {isLoadingPay && <Loader />}

                            {isPending ? <Loader /> : (

                            <div>
                              {/*<Button onClick={onApproveText} style={{marginBottom: '20px'}}>Test Pay Order</Button>*/}
                              <PayPalButtons
                              createOrder={createOrder}
                              onApprove={onApprove}
                              onError={onError}
                              ></PayPalButtons>
                              
                            </div>
                            
                           )
                           }
                          </ListGroup.Item>
                        )
                        
                      }

                      {loadingDeliver && <Loader/>}

                      {
                        userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                          <ListGroupItem>
                            <Button 
                            type='button' 
                            className='btn btn-block'
                            onClick={deliverOrderHandler} >
                              Mark as Delivered

                            </Button>
                          </ListGroupItem>
                        )
                      }
                  </ListGroup>
            </Card>


        </Col>
      </Row>
    </>
  );

}

export default OrderScreen