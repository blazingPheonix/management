"use client"



import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import Image from 'next/image'

const HeroSection = () => {

    const imageRef = useRef();
    useEffect(()=>{
        const image_element = imageRef.current;
        const handleScroll = ()=>{
            const scrollPosition = window.scrollY;
            console.log(scrollPosition);
            const scrollThreshold = 100;
            if(scrollPosition>scrollThreshold)
            {
                    // alert('ready to add scrolled')
                    console.log(image_element)
                    image_element.classList.add("scrolled");
            }else{
                image_element.classList.remove("scrolled");
            }

        }
        window.addEventListener('scroll',handleScroll);
        return ()=>window.removeEventListener('scroll',handleScroll);
    },[])
  return (
    <div className='flex flex-col items-center'>
         <div className='gradient-title text-6xl text-center max-w-3xl'>
            <h1>manage your finances </h1>with intelligence
         </div>
         <p className='text-xl mx-auto max-w-xl text-center mb-8 text-slate-600'>
            an ai_powered financila Lorem ipsum dolor sit amet ce praesentium corrupti suscipit harum sit. Neque, iste.

         </p>
         <div className='flex  gap-5'>
            <Link href='https://www.youtube.com/watch?v=egS6fnZAdzk&t=2067s'>
                <Button size='lg' className='px-8'>
                    Get started
                </Button>
            </Link>
            <Link href='https://www.youtube.com/watch?v=egS6fnZAdzk&t=2067s'>
                <Button size='lg' className='px-8' variant='outline'>
                    watch demo
                </Button>
            </Link>
         </div>
         <div className='mt-3 hero_image '  ref={imageRef}>
            <div>
                <Image src='/hero_img.png' height={720} width={1020} alt='hero-img'
                className='shadow-2xl border border-black rounded-lg'
                priority
               ></Image>
            </div>
         </div>

    </div>
  )
}

export default HeroSection