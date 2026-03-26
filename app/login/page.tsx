import { StarBackground } from "@/components/star-background";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = {
  title: "Log in - NovaStar",
  description: "Log in to your NovaStar account to access your portfolio and analysis tools.",
};

export default function LoginPage() {
  return (
    <>
      <StarBackground />
      <AuthForm mode="login" />
    </>
  );
}
