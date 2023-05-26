import {useState, useEffect} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom"
import {Form, Button } from 'react-bootstrap'
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {useDispatch, useSelector} from 'react-redux';
import {toast} from 'react-toastify'
import { useUpdateProductMutation, useGetProductDetailsQuery } from '../../slices/productsApiSlice';
import FormContainer from '../../components/FormContainer';




const ProductEditScreen = () => {
    const {id: productId} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const {data: product, isLoading, refetch, error} = useGetProductDetailsQuery(productId);
    const [updateProduct, {isLoading: LoadingUpdate, error: errorUpdate}] = useUpdateProductMutation();

   useEffect(()=>{
    if(product){
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);

    }

   },[product])

   const submitHandler = async (e) => {
    e.preventDefault();
    const updatedProduct = {
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description
    }
    const result = await updateProduct(updatedProduct);
    if(result.error){
        toast.error(result.error?.data?.message || result.error?.message)
    }else{
        toast.success('Product Updated')
        navigate('/admin/productlist')
    }

   }

  return (
    <>
    <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
    </Link>
    
    <FormContainer>
      <h3>Edit Product</h3>
        {LoadingUpdate && <Loader />}

        {isLoading ? <Loader/> : error ? <Message variant='danger'>{error}</Message>: (
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                    type='name'
                    placeholder='Enter name'
                    value={name}
                    onChange={(e)=> setName(e.target.value)}
                    >
                    </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='Price' style={{marginTop: '17px'}}>
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                    type='number'
                    placeholder='Enter Price'
                    value={price}
                    onChange={(e)=> setPrice(e.target.value)}
                    >
                    </Form.Control>
                    </Form.Group>
                    {/**Image will go here */}

                    <Form.Group controlId='Brand' style={{marginTop: '17px'}}>
                    <Form.Label>Brand</Form.Label>
                    <Form.Control
                    type='text'
                    placeholder='Enter Brand'
                    value={brand}
                    onChange={(e)=> setBrand(e.target.value)}
                    >
                    </Form.Control>
                   


                    <Form.Group controlId='CountInStock' style={{marginTop: '17px'}}>
                    <Form.Label>Count In Stock</Form.Label>
                    <Form.Control
                    type='number'
                    placeholder='Enter Count In Stock'
                    value={countInStock}
                    onChange={(e)=> setCountInStock(e.target.value)}
                    >
                    </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='Category' style={{marginTop: '17px'}}>
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                    type='text'
                    placeholder='Enter Category'
                    value={category}
                    onChange={(e)=> setCategory(e.target.value)}
                    >
                    </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='Description' style={{marginTop: '17px'}}>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                    type='text'
                    placeholder='Enter Description'
                    value={description}
                    onChange={(e)=> setDescription(e.target.value)}
                    >
                    </Form.Control>
                    </Form.Group>

                    <Button type='submit' variant='primary' style={{marginTop: '17px'}} >
                        Update
                    </Button>


                    </Form.Group>
            </Form>
        )
        }

    </FormContainer>
    </>
  )
}

export default ProductEditScreen