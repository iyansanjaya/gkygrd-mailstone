import { redirect } from "next/navigation";
import { getUser, signOut } from "@/lib/actions/auth";
import { AccountCard } from "@/components/organism/account-card";

export default async function AccountPage() {
  const user = await getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 -mt-[10%] sm:-mt-[4%]">
      <div className="w-full max-w-md">
        <AccountCard user={user} signOutAction={signOut} />
      </div>
    </div>
  );
}
