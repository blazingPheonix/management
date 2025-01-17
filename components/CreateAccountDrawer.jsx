"use client"

import React,{useState,useEffect} from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerTitle,
    DrawerHeader,
  
    DrawerTrigger,
  } from "@/components/ui/drawer"
  import { Button } from './ui/button'
  import { useForm } from 'react-hook-form'
import { accountSchema } from '@/lib/schema'
import { Input } from './ui/input'
import { useFetch } from '@/hooks/useFetch'
// import {zodResolver} from 'zod'
import { toast } from 'sonner'
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Switch } from './ui/switch'
import { createAccount } from '@/actions/dashboard'
import { Loader } from 'lucide-react'
  

  


console.log('check')
const CreateAccountDrawer = ({children}) => {
    const [open,setOpen] = useState(false);
    const {
        data:newAccount,
        error,
        fn:createAccountfn,
        loading:createAccountLoading
    } = useFetch(createAccount);
   
    const submitHandler = async(data)=>{
        console.log(data);
        console.log('*******************************************************************************************************accountcreated');

        // alert('ready to submit ');  
        // alert('account creatd');
        const res = await createAccountfn(data);
        console.log('*******************************************************************************************************accountcreated');
        // console.log(res);
        // if(res){
        //     toast.success("account created successfully");
        // }
        // else toast.error('error in account creation');
        // setOpen(false);
    }

    const {register,handleSubmit,formState:{errors},setValue,watch,
            reset,
        } =         useForm({
                resolver:zodResolver(accountSchema),
                defaultValues:{
                    name:"",
                    type:"CURRENT",
                    balance:"",
                    isDefault:false,
                }
            })
   


    useEffect(()=>{
       if(newAccount && !createAccountLoading){
        toast.success("account created successfully");
       }
       
       reset();
       setOpen(false);
       

    },[reset,newAccount]);

    useEffect(()=>{
        if(error){
            toast.error(error.message || "failed to create message");
        }
    },[error]);
  return (
    <div>
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild><div className=' '>{children}</div></DrawerTrigger>
            <DrawerContent>
            <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
        </DrawerHeader>
                <div>
                    <form className='py-2 px-3 flex flex-col gap-4' onSubmit={handleSubmit(submitHandler)}>
                        <div>
                            <label htmlFor='name' className='text-sm font-medium'>accountName</label>
                            <Input id='name' placeholder='john Doe' {...register('name')} ></Input>
                            <div>
                            {errors.name && (
                                <p className='text-sm text-red-500'> {errors.name.message} </p>
                            )}
                            </div>
                        </div>
                        <div>
                            <label htmlFor='type' className='text-sm font-medium'>Account_Type</label>
                            <Select onValueChange={(value)=>setValue("type",value)}
                            defaultValues={watch('type')}
                            >
                                <SelectTrigger id='type' className="w-[180px]">
                                    <SelectValue placeholder="select_type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CURRENT">current</SelectItem>
                                    <SelectItem value="SAVINGS">savings</SelectItem>
                                   
                                </SelectContent>
                            </Select>
                            <div>
                            {errors.type && (
                                <p className='text-sm text-red-500'> {errors.type.message} </p>
                            )}
                            </div>
                        </div>
                        <div>
                            <label htmlFor='balance' className='text-sm font-medium'>InitialBalance</label>
                            <Input id='balance'
                            type='number'
                            {...register('balance')} 
                            step='0.01'
                            placeholder='0.00'></Input>
                            <div>
                            {errors.balance && (
                                <p className='text-sm text-red-500'> {errors.balance.message} </p>
                            )}
                            </div>
                        </div>
                        <div className='flex justify-between w-full'>
                            <label htmlFor='name' className='text-sm font-medium'>DefaultAccount</label>
                            <Switch id='default'
                            onCheckedChange={(checked)=>setValue('isDefault',checked)}
                            checked={watch('isDefault')}
                            ></Switch>
                            
                            {errors.name && (
                                <p className='text-sm text-red-500'> {errors.name.message} </p>
                            )}
                             
                        </div>
                        <div>
                    
                    <div className='flex justify-between'>
                <DrawerClose asChild>
                        <Button type='button' variant='outline' className='flex-1'>
                            Cancel
                        </Button>
                </DrawerClose>
                        <Button type='submit'  className='flex-1' disabled={createAccountLoading}>
                           {createAccountLoading ? <Loader className='animate-spin w-12 h-12 text-blue-500'></Loader> : "createAccount"}
                        </Button>
                    </div>
                </div>
                    </form>
                </div>
               
                
                
            </DrawerContent>
        </Drawer>
    </div>
  )
}

export default CreateAccountDrawer