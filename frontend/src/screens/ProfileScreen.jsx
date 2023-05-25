import {useEffect, useState} from 'react';
import {Table, Form, Button, Row, Col} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import {FaTimes} from 'react-icons/fa'

const ProfileScreen = () => {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useDispatch()

    const {userInfo} = useSelector(state => state.auth)


     const [updateProfile, {isLoading: loadingUpdateProfile}] = useProfileMutation({})
     const {data: orders, isLoading, error } = useGetMyOrdersQuery();

    useEffect(() => {
        if(userInfo) {
            setEmail(userInfo.email)
            setName(userInfo.name)
        }

    }, [userInfo,userInfo.email, userInfo.name]);

    const submitHandler = async (e)=>{
        e.preventDefault();
       if(password !== confirmPassword) {
           toast.error('Passwords do not match')
           return
       }else{
        try{
            const res = updateProfile({_id: userInfo._id, email, name, password}).unwrap();
            
            dispatch(setCredentials(res))
            toast.success('Profile Updated')


        }catch(err){
            toast.error(err.message)
        }
       }

    }

  return (
    <Row>
        <Col md={3}>
            <h2>User Profile</h2>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='my-2'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='name'
                        placeholder='Enter name'
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                    ></Form.Control>
                    </Form.Group>


                    <Form.Group controlId='email' className='my-2'>
                    <Form.Label>Email Adress</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter Email'
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='password' className='my-2'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    ></Form.Control>
                    </Form.Group>


                    <Form.Group controlId='confirmPassword' className='my-2'>
                    <Form.Label></Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Confirm password'
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                    ></Form.Control>
                    </Form.Group>

                    <Button type='submit' variant='primary' className='my-2'>
                        Update
                    </Button>
                    {loadingUpdateProfile && <Loader />}
                </Form>
        </Col>
        <Col md={9}>
            <h2>My Orders</h2>

            {isLoading ? (<Loader/>): error? (
                <Message variant='danger'>
                    {error?.data?.message || error.error}
                </Message>
            ):
            <Table striped bordered hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Paid</th>
                        <th>Delivered</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((order)=>(
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.createdAt.substring(0, 10)}</td>
                            <td>${order.totalPrice}</td>
                            <td>{
                                order.isPaid ?(
                                    order.paidAt.substring(0,10)
                                ):(
                                    <FaTimes style={{color: 'red'}}/>
                                )
                                }
                            </td>

                            <td>
                                {
                                    order.isDelivered ?(
                                        order.deliveredAt.substring(0,10)
                                    ): (
                                        <FaTimes style={{color: 'red'}}  />
                                    )
                                }
                            </td>

                            <td>
                                <LinkContainer to={`/order/${order._id}`}>
                                    <Button className='btn-sm' variant='light'>
                                        Details
                                    </Button>
                                </LinkContainer>

                            </td>

                        </tr>

                    ))}

                </tbody>
            </Table>
            
            }
        </Col>
    </Row>
  )
}

export default ProfileScreen