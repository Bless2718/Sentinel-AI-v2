import AuthCard from "@/features/auth/components/auth-card";
import AuthHeader from "@/features/auth/components/auth-header";
import RegisterForm from "@/features/auth/components/register-form";
import SocialLogin from "@/features/auth/components/social-login";

export default function RegisterPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <AuthCard>
        <AuthHeader
          title="Create Account"
          subtitle="Start using Sentinel AI today."
        />

        <RegisterForm />

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-700" />
          <span className="text-sm text-slate-500">
            OR
          </span>
          <div className="h-px flex-1 bg-slate-700" />
        </div>

        <SocialLogin />
      </AuthCard>
    </div>
  );
}