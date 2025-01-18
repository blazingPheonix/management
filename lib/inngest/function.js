import { db } from "../prisma";
import { inngest } from "./client";
import { sendEmail } from "@/actions/send-email";
import Email from "@/emails/template";
// export const helloWorld = inngest.createFunction(
//   { id: "hello-world" },
//   { event: "test/hello.world" },
//   async ({ event, step }) => {
//     await step.sleep("wait-a-moment", "1s");
//     return { message: `Hello ${event.data.email}!` };
//   },
// );

export const checkBudgetAlerts = inngest.createFunction(
    { id: "fetch-budget" },
    {cron: '0 */6 * * *'},
    async ({  step }) => {
       const budgets = await step.run("fetch-budget",async()=>{
            return await db.budget.findMany({
                include:{
                    user:{
                        include:{
                            accounts:{
                                where:{
                                    isDefault:true,
                                },
                            },
                        },
                    },
                },

                
            });
       });
       for(const budget of budgets){
        const defaultAccount = budget.user.accounts[0];
        if(!defaultAccount) continue;

         
        await step.run(`check-budget-${budget.id}`,async()=>{
           const  startDate = new Date();
            startDate.setDate(1); 

            const currentDate = new Date();
            const endOfMonth = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth()+1,
                0
            );
            const expenses = await db.transaction.aggregate({
                where:{
                    userId:budget.userId,
                    accountId: defaultAccount.id,
                    type:"EXPENSE",
                    date:{
                        gte:startDate,
                        lte:endOfMonth
                    },  
                },
                _sum: {
                    amount:true,
                },
            });
            const totalExpenses = expenses._sum.amount?.toNumber() || 0 ; 
        const budgetAmount = budget.amount ; 
        const percentageUsed = (totalExpenses/budgetAmount)*100;

        console.log("percentage is ",percentageUsed,totalExpenses,budgetAmount);
        if(
            percentageUsed>=80 && 
            (!budget.lastAlertSent || 
                isNewMonth(new Date(budget.lastAlertSent),new Date())
            )
        ){
            //send email 
            console.log('((((((((((((((((((((((((((((((((((( ready to send email',budget)
            await sendEmail({
                to: budget.user.email,
                subject: `Budget Alert for ${defaultAccount.name}`,
                react: Email({
                  userName: budget.user.name,
                  type: "budget-alert",
                  data: {
                    percentageUsed,
                    budgetAmount: parseInt(budgetAmount).toFixed(1),
                    totalExpenses: parseInt(totalExpenses).toFixed(1),
                    accountName: defaultAccount.name,
                  },
                }),
              });
    
            //update last sent alert
            await db.budget.update({
                where: {id:budget.id},
                data:{lastAlertSent:new Date()},
            });
        }
        });
      
       

        
       }
    },
  );

  function isNewMonth(lastAlertDate, currentDate) {
    return (
        lastAlertDate.getMonth()!==currentDate.getMonth() ||
        lastAlertDate.getFullYear() !== currentDate.getFullYear() 
    )
  };