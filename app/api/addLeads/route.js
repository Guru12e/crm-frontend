import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
    const data = await req.json();

    const supabase = await createClient();

    try{
        const {data: lead, error} = await supabase.from("Leads").insert({
                            "name" : data.name,
                            "email":  data.email,
                            "number" : data.phone,
                            "age" : data.age,
                            "linkedIn" : data.linkedIn,
                            "industry" : data.industry,
                            "company" : data.company,
                            "income" : data.income,
                            "website" : data.website,
                            "status" : data.status,
                            "source" : data.source,
                            "address" : data.address,
                            "description" : data.description,
                            "user_email" : data.session.user.email,
    })

    if(error) {
        console.log(error)
    }
    return new NextResponse("success" , {status : 200})
} catch (err) {
    console.log(err)
    return new NextResponse("success" , {status : 200})
    }
}

