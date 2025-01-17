"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
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
}

export async function createAccount(data) {
    try{     
        const {userId} = await auth();
        if(!userId) throw new Error('unauthorised');

        const user = await db.user.findUnique({
            where:{clerkUserId:userId},
        });
        if(!user){
            throw new Error('user not found');
        }
        const balanceFloat = parseFloat(data.balance);
        if(isNaN(balanceFloat)){
            throw new Error('invalid balance amount');
        }
        //check if this is user's first balance account
        const existingAccounts = await db.account.findMany({
            where:{userId:user.id},
        });

        const shouldBeDefault = existingAccounts.length === 0 ? true: data.isDefault;
         
        if(shouldBeDefault) {
            await db.account.updateMany({
                where:{userId:user.id,isDefault:true},
                data: {isDefault:false},
            })
        }
        const account = await db.account.create({
            data:{
                ...data,
                balance:balanceFloat,
                userId:user.id,
                isDefault:shouldBeDefault,

            }
        })
        const serializedAccount = serializeTransaction(account);
        revalidatePath('/dashboard')
        return {success:true,data:serializedAccount};

    }catch(error)
    {
        console.error(error);
        throw new Error(error.message);
    }
}

export async function AccountData () {
    try{
        const {userId} = await auth();
        console.log('this is userId ',userId);
        if(!userId) {
            throw new Error('unauthorised');
        }
        const user = await db.user.findUnique({
            where:{
                clerkUserId:userId
            }
        });
        if(!user) {
            throw new Error('unauthorised')
        }
        const account_data = await db.account.findMany({
            where:{
                userId:user.id,
            },
            orderBy:{
                createdAt:"desc",
            },
            include:{
                _count: {
                    select: {
                        transactions:true,
                    },
                },
            },

        });
        console.log('printing account data ' , account_data);
        const serialisedAccount1 = account_data.map(serializeTransaction);
        // revalidatePath('/dashboard');

        console.log('this is serialise ',serialisedAccount1);
        return serialisedAccount1;
    }catch(error){
        console.error(error)
    }
}