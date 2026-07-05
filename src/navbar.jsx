import React from 'react'
import navBanner from './assets/img/Bitmap.png';
import { NavLink} from 'react-router-dom';

const Navbar = () => {
  return (
    <div style={{ backgroundImage: `url(${navBanner})` }} className='flex w-screen h-[35vh] bg-cover bg-no-repeat bg-center text-white justify-between items-center font-nunito relative p-5 sm:p-10'>
        <h1 className='text-white text-6xl font-poppins font-bold tracking-[15px]'>TODO</h1>
        <div className='flex sm:flex-row flex-col gap-2 sm:gap-5'>
        <NavLink to="/"
          className={({isActive})=> `text-white font-bold sm:tracking-[4px] ${isActive?"underline underline-offset-4":""}` }>
        Home
        </NavLink>
        <NavLink to="/history"
          className={({isActive})=> `text-white font-bold sm:tracking-[4px] ${isActive?"underline underline-offset-4":""}` } >
        History
        </NavLink>
        
        </div>
    </div>
  )
}

export default Navbar