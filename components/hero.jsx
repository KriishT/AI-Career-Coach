"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserOnboardingStatus } from "@/actions/user";

const HeroSection = () => {
  const { isSignedIn } = useUser();
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imageRef = useRef(null);
  useEffect(() => {
    const imageElement = imageRef.current;
    const HandleScroll = () => {
      const scrollPosition = window.scrollY;

      //this basically sets a threshold for when the image angle should change, the higher the value the later the angle change happens
      const scrollThreshold = 100;

      // adds or removes the class so when the scroll position is past the threshold, the associated styles are stopped
      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("hero-image-scroll");
      } else {
        imageElement.classList.remove("hero-image-scroll");
      }
    };

    //this basically adds the scroll event listener to the window so that it can detect when the user scrolls and call handleScroll
    window.addEventListener("scroll", HandleScroll);

    //cleans up after itself when the component unmounts
    return () => window.removeEventListener("scroll", HandleScroll);

    // IMPORTANT: the dependency array is empty so that the effect only runs once when the component mounts
  }, []);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (isSignedIn) {
        try {
          const status = await getUserOnboardingStatus();
          setIsOnboarded(status.isOnboarded);
        } catch (error) {
          console.error("Error checking onboarding status:", error);
          setIsOnboarded(false);
        }
      }
      setIsLoading(false);
    };

    checkOnboardingStatus();
  }, [isSignedIn]);

  return (
    <section className="w-full pt-36 md:pt-48 pb-10">
      <div className="space-y-6 text-center">
        <div className=" space-y-6 mx-auto">
          <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title">
            Your AI Career Coach for
            <br />
            Professional Success
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Advance your career with personalized guidance, interview prep, and
            AI-powered tools for job success
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Link href={isSignedIn && isOnboarded ? "/dashboard" : isSignedIn ? "/onboarding" : "/sign-up"}>
            <Button size="lg" className="px-8" disabled={isLoading}>
              {isLoading ? "Loading..." : isSignedIn && isOnboarded ? "Go to Dashboard" : isSignedIn ? "Complete Onboarding" : "Get Started"}
            </Button>
          </Link>
          <Link href={isSignedIn && isOnboarded ? "/dashboard" : isSignedIn ? "/onboarding" : "/sign-up"}>
            <Button size="lg" className="px-8" variant="outline" disabled={isLoading}>
              {isLoading ? "Loading..." : isSignedIn && isOnboarded ? "View Insights" : isSignedIn ? "Start Onboarding" : "Learn More"}
            </Button>
          </Link>
        </div>
        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageRef} className="hero-image">
            <Image
              src={"/banner.jpeg"}
              width={1280}
              height={720}
              alt="Banner SensAi"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            ></Image>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
