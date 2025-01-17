

import { accountsWithTransactions } from "@/actions/accounts";

export const fetchData = async(id) =>{
    console.log('bro thsi si ',(id.split('/')));
    const prt = id.split('/');
    console.log('prt ',prt);
    const part = prt[prt.length-1];

    console.log(part);
    const accountId = part;
    if(!accountId) return null ; 
    // const {id} = req.query;

    try {
         console.log('ready with aid ',accountId);
        const result = await accountsWithTransactions(accountId);
        console.log('after ',result);
        if(!result) return ;
        console.log('result ',result);
       return Response.json({data:result});
      } catch (error) {
        console.error("Error fetching account transactions:", error);
        return Response.json({ error: "Internal Server Error" });
      }
}