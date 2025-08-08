import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
    const data = await req.json();

    const supabase = await createClient();

    try{
        const {data: deal, error} = await supabase.from("Deals").insert({
"dealName" : data.dealName,
"dealOwner" : data.dealOwner,
  "email":  data.email,
  "number" : data.number,
  "title" : data.title,
  "value" : data.value,
  "status" : data.status,
  "closeDate" : data.closeDate,
  "leadSource" : data.leadSource,
  "priority" : data.priority,
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

