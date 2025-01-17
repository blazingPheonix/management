"use client"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';


const NotFound = () => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleMouseMove = (event) => {
    setPosition({ top: event.pageY, left: event.pageX });
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className='flex flex-col items-center gap-6 not-found-bg min-h-screen py-[8rem]'>
      <div className="text text-center">
        <h1>404</h1>
        <h2>Uh, Ohh</h2>
        <h3>Sorry we can't find what you are looking for 'cuz it's so dark in here</h3>
      </div>
      <div className="torch" style={{ top: position.top, left: position.left }}></div>
      <Link href='/home' className=' z-50 w-fit'><Button className='bg-green-50 text-black'>return home</Button></Link>
    </div>
  );
};

export default NotFound;
