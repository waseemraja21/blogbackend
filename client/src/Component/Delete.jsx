import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../Context/userContext';

export default function Delete() {
    const navigate = useNavigate();

    const {currentUser} = useContext(UserContext);
    const token = currentUser.token;


    //redirect to login page for any user who isn't logged in 
    useEffect(()=>{
        if(!token){
            navigate('/login');
        }
    }, [])

    
  return (
    <Link className='btn sm danger'>Delete</Link>
  )
}
