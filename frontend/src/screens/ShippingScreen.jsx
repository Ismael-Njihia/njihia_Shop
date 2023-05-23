import {useState} from 'react'
import { Form, Button} from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { saveShippingAddress } from '../slices/cartSlice'
import CheckoutSteps from '../components/CheckoutSteps'

const ShippingScreen = () => {
    const cart = useSelector((state) => state.cart);
    const {shippingAddress} = cart 


    const [address, setAddress] = useState();
    const [city, setCity] = useState()
    const [postalCode, setPostalCode] = useState()
    const [country, setCountry] = useState()
    const dispatch = useDispatch()
    const navigate = useNavigate()

  //  const submitHandler = (e) => {
   //     e.preventDefault()
   //     dispatch(saveShippingAddress({address, city, postalCode, country}))
   //     navigate('/payment')
   // }
    const submitHandlerBtn = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({address, city, postalCode, country}))
        navigate('/payment')
    }
  return (
    <FormContainer>
        <CheckoutSteps step1 step2/>
        <h1>Shipping</h1>
        <Form >
            <Form.Group controlId='address' className="my-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                    type='text'
                    placeholder='Enter Address'
                    value={address}
                    autoComplete='off'
                    onChange={(e) => setAddress(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='city' className="my-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                    type='text'
                    placeholder='Enter City'
                    value={city}
                    autoComplete='off'
                    onChange={(e) => setCity(e.target.value)}>
                    </Form.Control>
                </Form.Group>


                <Form.Group controlId='PostalCode' className="my-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                    type='text'
                    placeholder='Enter Postal Code'
                    value={postalCode}
                    autoComplete='off'
                    onChange={(e) => setPostalCode(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='country' className="my-3">
                <Form.Label>Country</Form.Label>
                <Form.Control
                    type='text'
                    placeholder='Enter Country'
                    value={country}
                    autoComplete='off'
                    onChange={(e) => setCountry(e.target.value)}>
                    </Form.Control>
                </Form.Group>


                <Button
                type='submit'
                variant='primary'
                className="mt-3"
                onClick={submitHandlerBtn}
                >
                    Continue
                </Button>

        </Form>
    </FormContainer>
  )
}

export default ShippingScreen