import { LinkContainer } from "react-router-bootstrap"
import {Table, Button, Row, Col} from 'react-bootstrap';
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetProductsQuery, useCreateProductMutation } from "../../slices/productsApiSlice";
import {toast} from 'react-toastify';

export const ProductListScreen = () => {
   const {data: products, isLoading, error, refetch} = useGetProductsQuery();
   

   const [createProduct, {isLoading: isLoadingCreate, error: errorCreate, success: successCreate}] = useCreateProductMutation();

const deleteHandler = (id) => {
  if(window.confirm(`Are you sure ${id}`)) {
    // delete products
  }
}
const createProductHandler = async () =>{
  if(window.confirm(`Are you sure to create a new product?`)) {
    try{
      await createProduct()
      refetch()

    }catch(error){
      toast.error(error?.data?.message  || error?.message)
    }
  }
}
  return (
    <>
    <Row>
      <Col>
      <h1>Products</h1>
      </Col>

      <Col className="text-end">
      <Button className="btn-sm m-3"
      onClick={createProductHandler}>
        <FaEdit /> Create Product
      </Button>
      </Col>
    </Row>
   { isLoadingCreate && <Loader />}
   {successCreate && toast.success('Product Created')}

    {isLoading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
      <>
      <Table striped bordered hover responsive className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
            <th></th>
            <th></th>
          </tr>
          </thead>
          <tbody>
            {products.map((product)=>(
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant="light" 
                    
                    className="btn-sm mx-2">
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  
                </td>
                <td>
                <Button variant= 'danger'
                 onClick={  () => deleteHandler(product._id)}
                 className="btn-sm">
                    <FaTrash style={{color: 'whitesmoke'}} />
                  </Button>

                </td>

                </tr>

            ))}
            </tbody>
        </Table>
        </>
    )}
    
    
    </>
  )
}
