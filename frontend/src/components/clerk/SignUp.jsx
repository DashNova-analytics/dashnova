import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="">
      <SignUp
        routing="path"
        path="/signup"
        signInUrl="/signin"
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