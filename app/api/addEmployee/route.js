import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request) {
  const data = await request.json();
  const supabase = await createClient();

  try {
    // 1. Fetch HRMS row for this user
    const { data: hrmsRows, error: fetchError } = await supabase
      .from("HRMS")
      .select("id, employees")
      .eq("user_email", data.session.user.email);

    if (fetchError) {
      console.error("Error fetching HRMS row:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // 2. Create new employee object
    const newEmployee = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      department: data.department,
      manager: data.manager,
      skills: data.skills || [],
      training: data.training || [],
      created_at: new Date().toISOString(),
    };

    let updatedRow;

    if (hrmsRows.length === 0) {
      // No HRMS row exists -> create a new one
      const { data: created, error: insertError } = await supabase
        .from("HRMS")
        .insert({
          user_email: data.session.user.email,
          employees: [newEmployee],
        })
        .select("*");

      if (insertError) {
        console.error("Error creating HRMS row:", insertError);
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }

      updatedRow = created[0];
    } else {
      // Row exists -> update employees array
      const existingRow = hrmsRows[0];
      const updatedEmployees = existingRow.employees
        ? [...existingRow.employees, newEmployee]
        : [newEmployee];

      const { data: updated, error: updateError } = await supabase
        .from("HRMS")
        .update({ employees: updatedEmployees })
        .eq("id", existingRow.id)
        .select("*");

      if (updateError) {
        console.error("Error updating employees array:", updateError);
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }

      updatedRow = updated[0];
    }

    return NextResponse.json(updatedRow, { status: 200 });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
