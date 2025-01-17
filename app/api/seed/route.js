import { seedTransactions } from "@/actions/seed";


export async function GET(){
    try{
    console.log('inside get ');
    const result = await seedTransactions();

    if(!result) return Response.json({data:"oye hoye"});
    console.log('this is the result',result);
    console.log('*********************************************************************************************************************');
    return result;
    }catch(error){
        console.error(error);
        console.log(error.message);
        return Response.json({"data":error.message})
    }
}