import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="">
      <SignIn
        routing="path"
        path="/signin"
        signUpUrl="/signup"
        fallbackRedirectUrl="/dashboard"
        appearance={{
          elements: {
            headerTitle: "text-2xl font-bold",
            headerSubtitle: "text-gray-500",
            formButtonPrimary:
              "bg-black hover:bg-gray-800 text-white rounded-lg",
            socialButtonsBlockButton:
              "border border-gray-300 hover:bg-gray-100 rounded-lg",
            footerActionLink: "text-black hover:text-gray-700",
          },
        }}
      />
    </div>
  );
}