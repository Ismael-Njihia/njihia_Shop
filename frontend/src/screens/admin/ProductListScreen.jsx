import { LinkContainer } from "react-router-bootstrap"
import {Table, Button, Row, Col} from 'react-bootstrap';
import { FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";
import { useGetProductsQuery,
  useDeleteProductMutation,
   useCreateProductMutation } from "../../slices/productsApiSlice";
import {toast} from 'react-toastify';

export const ProductListScreen = () => {

  const {pageNumber} = useParams()
   const {data, isLoading, error, refetch} = useGetProductsQuery({pageNumber});
   

   const [createProduct, {isLoading: isLoadingCreate, error: errorCreate, success: successCreate}] = useCreateProductMutation();
   const [deleteProduct, {isLoading: isLoadingDelete, error: errorDelete, success: successDelete}] = useDeleteProductMutation();
const deleteHandler = async (id) => {
  if(window.confirm(`Are you sure ${id}`)) {
    // delete products
    try {
      await deleteProduct(id)
      toast.success('Product deleted')
      refetch()
      
    } catch (error) {
      toast.error(error?.data?.message  || error?.message)
      
    }
  }
}
const createProductHandler = async () =>{
  if(window.confirm(`Are you sure to create a new product?`)) {
    try{
      await createProduct()
      toast.success('Product created')
      refetch()

    }catch(error){
      toast.error(error?.data?.message  || error?.message || errorDelete)
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
   {isLoadingDelete && <Loader />}
   

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
            {data.products.map((product)=>(
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

        <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
    )}
    
    
    </>
  )
}
