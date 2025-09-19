import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request) {
  try {
    const formData = await request.json();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.status ||
      !formData.session
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const data = new Date();

    const user = await supabase
      .from("Users")
      .select("id", "email")
      .eq("email", formData.session.user.email);

    if (user) {
      const { data: companyData, error: companyError } = await supabase
        .from("Customers")
        .insert({
          name: formData.name,
          number: formData.phone,
          email: formData.email || null,
          linkedIn: formData.linkedIn || null,
          address: formData.address || null,
          industry: formData.industry || null,
          website: formData.website || null,
          status: formData.status || "Active",
          issues: formData.issues || [],
          price: formData.price || null,
          customFields: formData.customFields || [],
          created_at: formData.created_at || data.toTimeString(),
          user_email: formData.session.user.email,
        })
        .select("*");

      if (companyError) {
        if (companyError.message.includes("duplicate key value")) {
          return NextResponse.json(
            { error: `Failed to insert company: ${companyError.message}` },
            { status: 404 }
          );
        }
        return NextResponse.json(
          { error: `Failed to insert company: ${companyError.message}` },
          { status: 500 }
        );
      }

      return NextResponse.json(companyData, { status: 200 });
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
