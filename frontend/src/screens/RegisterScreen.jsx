import { useState, useEffect } from "react"
import { Form, Button, Row, Col } from "react-bootstrap"
import { Link, useLocation, useNavigate } from "react-router-dom"
import FormContainer from "../components/FormContainer"
import { useSelector, useDispatch } from "react-redux"
import Loader from "../components/Loader"
import { useRegisterMutation } from "../slices/usersApiSlice"
import { setCredentials } from "../slices/authSlice"
import { toast } from "react-toastify"

const RegisterScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [register, {isLoading}] = useRegisterMutation()

    const { userInfo } = useSelector(state => state.auth)

    const { search } = useLocation()
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'

    useEffect(()=>{
        if(userInfo){
            navigate(redirect)
        }
    }, [userInfo, redirect, navigate])

    const submitHandler = async (e) => {
        e.preventDefault()
        if(password !== confirmPassword){
            toast.error('Passwords do not match')
            return
        }else{
       try{
        const res = await register({name, email, password}).unwrap()
        dispatch(setCredentials({...res,}))
        navigate(redirect)
        toast.success('Register Success')
       }catch(err){
              toast.error(err?.data?.message || err?.data.error)

       }
    }
    }
  return (
    <FormContainer>
        <h1>Sign Up</h1>

        <Form onSubmit={submitHandler}>
        <Form.Group controlId='name' className="my-3">
                <Form.Label>Enter your Full Name</Form.Label>
                <Form.Control
                    type='name'
                    placeholder='Enter your Full Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}>

                    </Form.Control>

            </Form.Group>



            <Form.Group controlId='email' className="my-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                    type='email'
                    placeholder='Enter email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}>

                    </Form.Control>

            </Form.Group>


            <Form.Group controlId='password' className="my-3">
                <Form.Label>Password </Form.Label>
                <Form.Control
                    type='password'
                    placeholder='Enter password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}>
                        
                    </Form.Control>

            </Form.Group>


            <Form.Group controlId='Confirmpassword' className="my-3">
                <Form.Label>Confirm Password </Form.Label>
                <Form.Control
                    type='password'
                    placeholder='Confirm password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}>
                        
                    </Form.Control>

            </Form.Group>

            <Button type='submit' variant='primary' className="mt-3"  disabled={isLoading}>
                
                register
            </Button>

            {
                isLoading && <Loader />
            }
        </Form>

        <Row className='py-3'>
            <Col>
                Already a Customer? <Link to={redirect ? `/login? redirect=${redirect}` : '/login'}>Login</Link>
            </Col>

        </Row>

    </FormContainer>
    
  )
}

export default RegisterScreen