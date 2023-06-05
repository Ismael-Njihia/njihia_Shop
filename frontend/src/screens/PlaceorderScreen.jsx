import React, {useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import CheckoutSteps from '../components/CheckoutSteps'
import  {toast}  from 'react-toastify'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useCreateOrderMutation } from '../slices/ordersApiSlice'
import { clearCartItems } from '../slices/cartSlice'



const PlaceOrderScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const cart = useSelector((state) => state.cart)
    const [createOrder, {isLoading, error} ] = useCreateOrderMutation()
  


    useEffect(()=>{
        if(!cart.shippingAddress){
            navigate('/shipping')
        }else if(!cart.paymentMethod){
            navigate('/payment')
        }
    }, [cart.paymentMethod, cart.shippingAddress, navigate])


    const placeOrderHandler = async ()=>{
       try{
        const res = await createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        }).unwrap();
        dispatch(clearCartItems())
        toast.success('Order Placed Successfully')
        navigate(`/order/${res._id}`)

        
       }catch(error){
          toast.error(error.message)

       }
        

    }
  return (
    <>
    <CheckoutSteps step1 step2 step3 step4/>
      <Row>
        <Col md={8}>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h2>Shipping Info</h2>
                    <p>
                        <strong>Address: </strong>
                        {cart.shippingAddress.address}-{cart.shippingAddress.postalCode}, {cart.shippingAddress.city},
                         {cart.shippingAddress.country}
                    </p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <strong>Method: </strong>
                        {cart.paymentMethod}
                    </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cart.cartItems.length === 0 ? <Message>Your cart is empty</Message> : (
                                <ListGroup  variant='flush'>
                                    {cart.cartItems.map((item, index) =>(
                                    <ListGroup.Item key={index}>
                                    <Row>
                                        <Col md={1}>
                                            <Image src={item.image} alt={item.name} fluid rounded/>
                                        </Col>
                                        <Col>
                                            <Link to={`/product/${item._id}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={4}>
                                            {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                        </Col>
                                    </Row>
                                    </ListGroup.Item>
                                   ))}
                                </ListGroup>
                                
                            )}
                            </ListGroup.Item>
                </ListGroup>

        </Col>
        <Col md={4}>
            <Card>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Order Summary</h2>
                    </ListGroup.Item>
                    

                    <ListGroup.Item style={{margin: '15px'}}>
                        <Row>
                            <Col >Items</Col>
                            <Col>${cart.itemsPrice}</Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item style={{margin: '15px'}}>
                        <Row>
                            <Col >Shipping Price</Col>
                            <Col>${cart.shippingPrice}</Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item style={{margin: '15px'}}>
                        <Row>
                            <Col >Tax</Col>
                            <Col>${cart.taxPrice}</Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item style={{margin: '15px'}}>
                        <Row>
                           <Col> <strong >Total</strong></Col>
                           <Col> <strong>${cart.totalPrice}</strong></Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        {error && <Message variant='danger'>{error}</Message>}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        {error && <Message variant='danger'>{error}</Message>}
                        </ListGroup.Item>

                    <ListGroup.Item>
                        <Button type='button' className='btn-block' disabled={cart.cartItems === 0} onClick= {placeOrderHandler}>
                            Place Order
                        </Button>

                        {
                            isLoading && <Loader/>
                        }
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Button type='button' className='btn-block' onClick= {()=> navigate('/payment')}>
                            Back
                        </Button>
                    </ListGroup.Item>

                    </ListGroup>
                </Card>
            
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen