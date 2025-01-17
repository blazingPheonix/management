"use client"

import { accountsWithTransactions } from '@/actions/accounts';
import React, { Suspense, useEffect , useState} from 'react'
import { fetchData } from '@/app/api/accounts/[id]/router';
import { notFound } from 'next/navigation';
import Transaction_table from '../_components/transaction_table';
import { BarLoader } from 'react-spinners';
import Account_Charts from '../_components/Account_Charts';



  

function page({params}) {

    const [accountId,setAccountId] = useState("");
    const [transactionData,setTransaction] = useState(null);
    const [balance,setBalance] = useState("");
    useEffect( ()=>{
        console.log('ok')
        const getId = async()=>{
            const res = await params;
            console.log('this is res ',res);
            // console.log(accountId,"ok ",res);
            setAccountId(res.id);     
            // setBalance(res.balance);
            const res1 = await fetchData(`/api/accounts/${res.id}`,{data:res.id,});
            // alert('fetched')
            // console.log('namaste ji ',res1,res.id)
            const result =await res1.json();
            setBalance(result.data.balance.toFixed(2));
            console.log('printijfask  ...............................',result)
            if(!res1) notFound() ;
            console.log('namaste ji 2 result ',result.data)

            // const data = await res1.json();
            console.log('data received ',result.data);
            setTransaction(result.data);

        };
     getId();
       
    },[params]);

    // const res = await accountsWithTransactions(accountId);
    // console.log(res);
  return (
    <div className='w-[1280px] mx-auto'>
        <div className='flex justify-between mb-8'>
            <div className='text-green-500 text-xl font-extrabold'>Transactions</div>
            <div className='font-bold'>{balance}</div>
        </div>
        {/* {transactionData.balance} */}
        

        {/* <div>
            <h1>account.name</h1>
            <p> account.type.charAt(0)+account.type.slice(1).toLowerCase()  account</p>
        </div>
        <div>
            <div>parse.Float(account.balance).toFixed(2)</div>
            <p>account._count.transactions  transactions</p>
        </div> */}

        {/* chart section */}
        <Suspense fallback={<BarLoader className='mt-4' width={'100%'} color='green' />}>
            
            {transactionData && <Account_Charts item = {transactionData}></Account_Charts>}
            
         </Suspense>
            
        {/* Transaction section */}
        <Suspense fallback={<BarLoader className='mt-4' width={'100%'} color='green' />}>
            
           {transactionData && <Transaction_table item = {transactionData}></Transaction_table>}
           
        </Suspense>
    </div>
  )
}

export default page