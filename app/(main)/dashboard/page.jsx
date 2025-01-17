
import React from 'react'
import CreateAccountDrawer from '@/components/CreateAccountDrawer'
import { PlusCircle,ArrowUpRight,ArrowDownRight } from 'lucide-react'
import { AccountData } from '@/actions/dashboard'



import Link from 'next/link'
import Account_card from './_components/Account_card'
import { getCurrentBudget } from '@/actions/budget'
import { BudgetProgress } from '../accounts/_components/budget_progress'

const DashboardPage = async() => {
  const res = await AccountData();
  console.log('data ',res);
  // const res = data.data;
  const accounts = await AccountData();
  const defaultAccount = accounts?.find((account)=>account.isDefault);

  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  console.log('thsi si bjlsdfjlsdjflsdf dsflk ',budgetData)
  console.log('chaka chaka ',res);
  return (
    <div className='flex flex-col justify-center items-center'>
        {defaultAccount && <BudgetProgress initialBudget={budgetData?.budget} currentExpenses = {budgetData?.budget?.expenses || 0}></BudgetProgress>}
        <h1 className='gradient-title'>Dashboard</h1>
        <CreateAccountDrawer>
          <div className='flex flex-col justify-center items-center border  rounded-md md:p-6 shadow-2xl gap-3 w-[25rem] hover:scale-95 ease-in duration-300'>
            <div>
              create Account
            </div>
            <div>
              <PlusCircle></PlusCircle>
            </div>
          </div>
        </CreateAccountDrawer>
        <div className='grid grid-cols-4 gap-6 mt-6  '>
        {
          res.map((item,index)=>{
            return (
              <div key={index}>
                <Account_card item = {item}></Account_card>  
              </div>
            )

          })
        }
        </div>
      
    </div>
  )
}

export default DashboardPage