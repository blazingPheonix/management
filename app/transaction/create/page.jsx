

import { AccountData } from '@/actions/dashboard';
import { defaultCategories } from '@/data/categories';
import React from 'react'
import { AddTransactionForm } from '../_components/transaction_form';


const AccountTransactionPage = async() => {
    const accounts = await AccountData();
    // alert('jh')
    console.log('printing account ',accounts);
  return (
    <div className='max-w-xl mx-auto px-5'>
            <h1 className='text-6xl gradient-title mb-8'>   add transaction </h1>
            <AddTransactionForm
            accounts={accounts}
            categories = {defaultCategories}
            >
                
            </AddTransactionForm>
    </div>
  )
}

export default AccountTransactionPage