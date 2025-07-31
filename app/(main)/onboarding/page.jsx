import { industries } from "@/app/data/industries";
import React from "react";
import OnboardingForm from "./_components/OnboardingForm";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";

const Page = async () => {
  try {
    const { isOnboarded } = await getUserOnboardingStatus();
    if (isOnboarded) {
      redirect("/dashboard");
    }
    return (
      <main>
        <OnboardingForm industries={industries} />
      </main>
    );
  } catch (error) {
    console.error("Error in onboarding page:", error);
    // Fallback to showing the onboarding form even if there's an error
    return (
      <main>
        <OnboardingForm industries={industries} />
      </main>
    );
  }
};

export default Page;
