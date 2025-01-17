import Image from "next/image";
import HeroSection from "@/components/HeroSection";
import { statsData,featuresData,howItWorksData,testimonialsData } from "@/data/landing";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  return (
    <div className="text-center">
      welcome to management app
      <HeroSection></HeroSection>
      <section>
        <div className="text-center mt-4 bg-green-300 text-2xl font-bold text-red-900">
          <div className="flex gap-10 text-center justify-center py-8">
            {statsData.map((stats,index)=>{
              return (
              <div key={index}>
              
                <div className="text-2xl">{stats.value}</div>
                <div>{stats.label}</div>
                
              </div>)
            })}
          </div>
        </div>
      </section>
    {/* hello world */}
      <section>
         features 
        <div  className="grid  grid-cols-3 content-center justify-items-center gap-4  items-center py-4">
            {
              featuresData.map((item,index)=>{
                return (
                  <Card className="w-[350px] md:h-[250px] flex flex-col items-center justify-center shadow-yellow-800 shadow-2xl hover:scale-110 ease-out duration-100  border-black font-medium text-purple-800 py-2" key={index}>
                          {item.icon}
                        <CardHeader>
                          <CardDescription>{item.title}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {item.description}
                        </CardContent>
                       
                    </Card>
                )
              })
            }
        </div>
      </section>
      <section className="bg-blue-200">
         <h1 className="font-2xl text-2xl">How it works </h1>
        <div  className=" flex justify-between items-center text-md font-bold text-emerald-700 ">
            {
              howItWorksData.map((item,index)=>{
                return (
                  <Card className="w-[350px] md:h-[200px] flex flex-col items-center justify-center text-emerald-800 bg-transparent border-collapse border-none shadow-none" key={index}>
                          {item.icon}
                        <CardHeader className='text-slate-800'>
                          <CardDescription>{item.title}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {item.description}
                        </CardContent>
                       
                    </Card>
                )
              })
            }
        </div>
      </section>

      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-4">
                  <div className="flex items-center mb-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="ml-4">
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{testimonial.quote}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their finances
            smarter with Welth
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 animate-bounce"
            >
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
