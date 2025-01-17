import React, { Suspense } from 'react'
import DashboardPage from './page'
import { BarLoader } from 'react-spinners'

const layout = () => {
  return (
    <div>
        <Suspense>
            <DashboardPage fallback={<BarLoader className='mt-4' width={"100%"} color='blue'></BarLoader>}></DashboardPage>
        </Suspense>
    </div>
  )
}

export default layout