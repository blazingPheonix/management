"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeTransaction = (obj) => {
    const serialised = {...obj};

    if(obj.balance){
        serialised.balance = obj.balance.toNumber();
    }
    if(obj.amount){
        serialised.amount = obj.amount.toNumber(); 
    }
    // if(obj.transactions)
    return serialised;
}

export async function updateAccount (accountId)  {
    try{
        const {userId} = await auth();
        if(!userId){
            throw new Error("unauthorised");
        }
        const user = await db.user.findUnique({
            where:{
                clerkUserId:userId
            }
        });
        if(!user){
            throw new Error('usesr invalid');
        }
        await db.account.updateMany({
            where:{userId:user.id,isDefault:true},
            data:{isDefault:false},
        })
        const res = await db.account.update({
            where:{
                id:accountId,
                userId:user.id,
            },
            data:{isDefault:true},
        });
       
        revalidatePath('/dashboard');
        return {success:true,data:serializeTransaction(res)};
    }catch(error)
    {
        return {success:false,error:error.message};
    }
}


// export async function accountsWithTransactions(accountId){
    
//     const {userId} = await auth();
//     if(!userId) throw new error("user invalid");

//     const user = await db.user.findUnique({
//         where:{
//             clerkUserId:userId
//         }
//     });
//     if(!user) throw new Error("invalid user");
//     // console.log('this is uer ',user,accountId);
//     // console.log('this si accountId ',accountId);
//     // // console.log('type ',typeof(ccountId));
//     const acid = Object.values(accountId);
//     // console.log('type ',typeof(acid));

//     if(accountId===null) throw new error("invalid accountId");

//     const transactions = await db.account.findUnique({
//         where:{
//             id:accountId,
//             userId:user.id,
//         },
//         include:{
//             transaction:{
//                 orderBy:{date:"desc"},
//             },
//             _count:{
//                 select:{transaction:true},
//             },
//         },
//     });
//     if(!transactions) return null ; 
//     // console.log('reveived',transactions);
//     return {
//         ...serializeTransaction(transactions),
//         transactions: transactions.transactions.map(serializeTransaction)
//     }


// }


export async function accountsWithTransactions(accountId) {
    console.log('inside ');
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) throw new Error("User not found");
  
    const account = await db.account.findUnique({
      where: {
        id: accountId,
        userId: user.id,
      },
      include: {
        transactions: {
          orderBy: { date: "desc" },
        },
        _count: {
          select: { transactions: true },
        },
      },
    });
    //  console.log('user id and t id ',user.id,id);
    if (!account) return null;
    console.log('this is account ',account);
    return {
     ...serializeTransaction(account),
      transactions: account.transactions.map(serializeTransaction),
    };
  };



export async function bulkDelete(transactionIds)
{
  try{
    const {userId} = await auth();
    if(!userId) throw new Error("unauthorised");

    const user = await db.user.findUnique({
      where:{
        clerkUserId:userId
      }
    });
    if(!user) throw new Error("no user exists");

    const transactions = await db.transaction.findMany({
      where:{
        id:{in:transactionIds},
        userId:user.id,
      }
    });
    console.log('this is transactoin ',transactions)
    const accountBalancechanges = transactions.reduce((acc,curr)=>{
      const change = curr.type==='EXPENSE'?curr.amount:-curr.amount;
      acc[curr.accountId] =(acc[curr.accountId] || 0) + parseFloat(change);
      return acc;
    },{});

    console.log('this si account balance changes ',accountBalancechanges);
    //delete transactions and update account balance in a transaction ---> to deep ---dive )))))[]
    await db.$transaction(async(tx)=>{
      await tx.transaction.deleteMany({
        where:{
          id:{in:transactionIds},
          userId:user.id,
        },
      });
      for(const [accountId,balanceChange] of Object.entries(
        accountBalancechanges
      )){
        // const decimalChange = new Decimal(balanceChange);
        console.log('accoutnId ',accountId,"banca ",balanceChange);
        await tx.account.update({
          where:{id:accountId},
          data:{
            balance:{
              increment:balanceChange,
            },
          },   
        })
      };
    }
  );
  revalidatePath('/dashboard');
  revalidatePath('/accounts/[id]');
  return {success:true};
  }catch(error){
    console.error(error.message);
    return {success:false,message:"error in bulk deletion"};
  }
    
}