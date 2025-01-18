"use server"

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";


const serializeTransaction = (obj) => {
    const serialised = {...obj};

    if(obj.balance){
        serialised.balance = obj.balance.toNumber();
    }
    if(obj.account){
        serialised.amount = obj.amount.toNumber(); 
    }
    return serialised;
};


export async function createTransaction (data) {
    try{
        console.log('inse (((((((((((((((((((((((()))))))))))))))))))))))))))))))))))) ct',data)
        const {userId} = await auth();
        console.log('userId',userId)
        if(!userId) throw Error("unauthorises");

        //arcjet to add rate limiting
        console.log('inse (***********************************))))))))))))))))))))))))))) ct')

        const user = await db.user.findUnique({
            where: {clerkUserId:userId},
        });
        if(!user){
            throw new Error("user not found");
        }

        const account = await db.account.findUnique({
            where:{
                id:data.accountId,
                userId:user.id,
            },
        });
        if(!account){
            throw new Error("account not found");
        }
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ acount veririfed',account)
        // const check = await db.transaction.findMany();
        // console.log('check ',check);
        const balanceChange = data.type==='EXPENSE' ? -data.amount:data.amount ; 
        const newbalance = account.balance.toNumber()+balanceChange;
            console.log('####################################',newbalance)
         const transaction = await db.$transaction(async(tx)=>{
                                console.log('ready bro ',data,user.id,typeof(data.date))
                                const abc = {
                                        ...data,
                                        userId:user.id,
                                        nextRecurringDate:data.isRecurring && data.recurringInterval
                                        ? calculateNextRecurringDate(data.date,data.recurringInterval):
                                        null,
                                    };
                                        console.log('checking payload ',abc,data.date,typeof(data.date),typeof(abc));
                                        const newTransaction = await tx.transaction.create({
                                            data:{
                                                ...data,
                                                userId:user.id,
                                                date: new Date(data.date).toISOString(),
                                                nextRecurringDate:data.isRecurring && data.recurringInterval
                                                ? calculateNextRecurringDate(data.date,data.recurringInterval):
                                                null,
                                            },
                                             });
            console.log('****************** transaction created ',newTransaction);
            await tx.account.update ({
                where:{ id: data.accountId },
                data: {balance:newbalance},
            });

            return newTransaction;
         }
        
        );
         revalidatePath('/dashboard');
         revalidatePath(`/account/${transaction.accountId}`);

         return {success:true,data:serializeAmount(transaction)};
    }catch(error){
            console.error("Error in createTransaction:", error);
            
    }
}

function calculateNextRecurringDate (startDate , interval) {
    const date = new Data(startDate);

    switch(interval){
        case "DAILY":
            date.setDate(date.getDate()+1);
            break;
        case "WEEKLY":
            date.setDate(date.getDate()+7);
            break;
        case "MONTHLY":
            date.setMonth(date.getMonth()+1);
            break;
        case "YEARLY":
            date.setFullYear(date.getFullYear()+1);
            break;
    }
}