import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import OnBoardingForm from "@/components/forms/OnBoardingForm";
import { supabase } from "@/utils/supabase/client";

export default async function OnBoardingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/auth/redirect?callbackUrl=/on-boarding`);
  }

  const userEmail = session.user.email;
  const { data: user, error } = await supabase
    .from("Users")
    .select("*")
    .eq("email", userEmail)
    .single();

  if (!user) {
    return <OnBoardingForm session={session} />;
  } else {
    return redirect(`/home`);
  }
}
