import { LinkContainer } from "react-router-bootstrap"
import {Table, Button} from 'react-bootstrap';
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {toast} from 'react-toastify'
import { useGetUsersQuery, useDeleteUserMutation } from "../../slices/usersApiSlice";

const UserListScreen = () => {
 
  const {data: user, refetch,  isLoading, error} = useGetUsersQuery();
  const [deleteUser, {isLoading: loadingDelete}]  = useDeleteUserMutation();


  const deleteHandler = async (id) =>{
    if(window.confirm(` Are you sure you want to delete this  ${id}` )){
       try {
        await deleteUser(id);
        refetch()
        toast.success('User deleted')
        
       } catch (error) {
        toast.error(error?.data?.message || error.error)
        
       }
    }
  }
  return (
    <>
    <h3>Users</h3>
    {loadingDelete && <Loader/>}
    {
      isLoading ? (
        <Loader/>
      ): error? (
        <Message variant='danger'>
         {error?.data?.message}
        </Message>
      ) : (
        <Table stripped hover reponsive  className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
            
              
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              user.map((user)=>(
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td><a href={`mailto: ${user.email}`}>{user.email}</a></td>
                 
                  <td>
                    {
                      user.isAdmin ?(
                        <FaCheck style={{color: 'green'}}/>

                      ): (
                       <FaTimes style={{color: 'red'}}/>
                      )
                    }
                  </td>
                 

                   <td>
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                      <Button className="btn-sm" variant="light">
                        <FaEdit/>
                      </Button>
                    </LinkContainer>

                    
                   </td>

                   <td>
                   <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={()=> deleteHandler(user._id)}
                    >
                        <FaTrash style={{color: 'whitesmoke'}}/>
                    </Button>

                   </td>

                </tr>
              ))
            }

          </tbody>


        </Table>
      )
    }
    
    </>
  )
}

export default UserListScreen