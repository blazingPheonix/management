import { Resend } from "resend";

export async function sendEmail ({to,subject,react}){
        const resend = new Resend(process.env.RESEND_API_KEY|| "");
        try {
            const { data, error } = await resend.emails.send({
              from: 'management <onboarding@resend.dev>',
              to: to,
              subject: subject,
              react: react ,
            
            });
        
            if (error) {
              return Response.json({ error }, { status: 500 });
            }
        
            return Response.json(data);
          } catch (error) {
            return Response.json({ error }, { status: 500 });
          }
}