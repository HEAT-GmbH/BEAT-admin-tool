import { Logo } from "@/components/logo";
import Image from "next/image";
import { AuthForm } from "./form";

export default function AuthScreen() {
  return (
    <main className="flex items-stretch p-2.5 gap-4 flex-1">
      <section className="flex-1 flex flex-col items-center justify-between gap-4">
        <div className="flex-1 w-full max-w-89 flex flex-col items-center justify-center p-4 m-auto">
          <Logo className="mb-6" />
          <h1 className="text-2xl font-extrabold text-foreground">
            Welcome Back
          </h1>
          <p className="paragraph-small text-(--text--sub-600) mt-2 mb-6">
            Enter your details to create your account.
          </p>
          <AuthForm />
        </div>
        <p className="flex items-center justify-center gap-1 text-xs">
          <a className="underline">Terms of use</a>
          <span>and</span>
          <a className="underline">Privacy policy</a>
        </p>
      </section>
      <section className="flex w-full rounded-3xl overflow-hidden relative max-lg:hidden max-w-144.5">
        <Image fill priority src="/onboarding.png" alt="background image" />
        <div className="absolute bottom-0 left-0 w-full pl-[3.188rem] pr-29.5 pb-[4.313rem] z-1">
          <div className="flex flex-col text-white">
            <h1 className="text-[2.5rem]/[103%] font-black">
              Building Emission Assessment Tool
            </h1>
            <p className="text-sm">
              Accelerating the transition towards zero and low carbon buildings
              through data-driven decisions
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
