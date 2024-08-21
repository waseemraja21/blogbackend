import React from 'react'
import LoadingGif from '../images/loading.gif';


function Loader() {
  return (
    <div className='loader'>
        <div>
            <img src={LoadingGif} alt=''/>
        </div>
    </div>
  )
}

export default Loader