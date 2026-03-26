import { StarBackground } from "@/components/star-background";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = {
  title: "Sign up - NovaStar",
  description: "Create a free NovaStar account to start analyzing Indian stocks with professional-grade tools.",
};

export default function SignupPage() {
  return (
    <>
      <StarBackground />
      <AuthForm mode="signup" />
    </>
  );
}
