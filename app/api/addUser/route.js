import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req) {
    const data = await req.json();

    const supabase = await createClient();

    try{
        const {data: user, error} = await supabase.from("Users").insert({
"name" : data.name,
  "email":  data.email,
  "role" : data.role,
  "companyName" : data.companyName,
  "companyWebsite" : data.companyWebsite,
  "industry" : data.industry,
  "companySize" : data.companySize,
  "products" : data.products,
  "companyDescription" : data.companyDescription,
  "phone" : data.phone
    })

    if(error) {
        console.log(error)
    }
    return new NextResponse("sucess" , {status : 200})
} catch (err) {
    console.log(err)
    return new NextResponse("sucess" , {status : 200})
    }
}