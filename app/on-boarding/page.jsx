import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import OnBoardingFormComponent from "@/components/OnBoardingFormComponent";
import { supabase } from "@/utils/supabase/client";

export default async function OnBoardingForm() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/auth/redirect?callbackUrl=/on-boarding`);
  }

  const userEmail = session.user.email;
  console.log(session);
  console.log(userEmail);
  const { data: user, error } = await supabase
    .from("Users")
    .select("*")
    .eq("email", userEmail)
    .single();
  console.log("User data:", user);
  if (!user) {
    return <OnBoardingFormComponent session={session} />;
  } else {
    return redirect(`/home`);
  }
}
