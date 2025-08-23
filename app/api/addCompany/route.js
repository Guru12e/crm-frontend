import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request) {
  try {
    const formData = await request.json();

    if (
      !formData.name ||
      !formData.email ||
      !formData.role ||
      !formData.phone ||
      !formData.companyName ||
      !formData.companyWebsite ||
      !formData.companyDescription ||
      !formData.industry ||
      !formData.products ||
      !Array.isArray(formData.products)
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: companyData, error: companyError } = await supabase
      .from("Companies")
      .insert({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite,
        companyDescription: formData.companyDescription,
        industry: formData.industry,
        companySize: formData.companySize,
        products: formData.products,
      })
      .select()
      .single();

    if (companyError) {
      return NextResponse.json(
        { error: `Failed to insert company: ${companyError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
