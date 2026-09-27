import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

export default function SocialLogin() {
  return (
    <Button
      variant="outline"
      className="w-full justify-center"
    >
      <FcGoogle className="mr-2 text-xl" />
      Continue with Google
    </Button>
  );
}