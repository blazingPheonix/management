"use client"

import React,{useEffect, useState} from 'react'

import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { ArrowUpRight,ArrowDownRight } from 'lucide-react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateAccount } from '@/actions/accounts';
import { useFetch } from '@/hooks/useFetch';


 function Account_card({item}) {
    
  const {data,loading,error,fn,setData} = useFetch(updateAccount);
  // console.log('received item ',item);
  const {balance,id,isDefault,name,type} = item;
 
  const defaultHandler = async (e) => {
    e.preventDefault();
    console.log(e.target.checked);
    e.target.checked = isDefault;

    if(isDefault===true){
      toast.error('atleast one account should be default');
      return ;
    }
      const res = await fn(id);
      console.log('this is ',res);
      if(res.success===true){
        toast.success('default account updated successfully');
      }
    

  }

  return (
    <div>
        <Card className='flex flex-col justify-center items-center hover:shadow-md transition-shadow group relative'>
                    <Link href={`/accounts/${item.id}`}>
                       <CardHeader className='flex flex-col items-center'>
                          <CardTitle>{item.name}</CardTitle>
                          <Switch onClick={defaultHandler} checked={isDefault} disabled={loading}></Switch>
                          </CardHeader>
                        <CardContent className='flex flex-col items-center'>
                        <div>
                          <div>${parseFloat(item.balance).toFixed(2)}</div>
                        </div>
                        <p className='text-xs text-muted-foreground'>
                          {item.type.charAt(0) + item.type.slice(1).toLowerCase()} Account
                        </p>
                        </CardContent>
                        <CardFooter className='flex flex-row justify-between'>
                          <div className='flex items-center text-muted-foreground text-sm'>
                            <ArrowUpRight className='text-green-600'></ArrowUpRight> Income
                          </div>
                          <div className='flex items-center text-muted-foreground text-sm'>
                            <ArrowDownRight className='text-red-600'></ArrowDownRight> Expense
                          </div>
                          <div></div>
                        </CardFooter>
                        </Link>
                  </Card>
    </div>
  )
}

export default Account_card