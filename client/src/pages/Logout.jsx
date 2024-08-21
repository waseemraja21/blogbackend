import React , {useContext, useEffect} from 'react'
import { UserContext } from '../Context/userContext'
import { useNavigate } from 'react-router-dom'


export default function Logout() {

  const {setCurrentUser} = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Perform the logout logic here
    setCurrentUser(null);
    navigate('/login');
  }, []); // Empty dependency array ensures this effect runs only once
  
  return null;

}
