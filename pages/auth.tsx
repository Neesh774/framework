import { Button, Center } from "@chakra-ui/react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";

export default function Auth() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const { redirect } = router.query;
  const toast = useToast();
  const session = useSession();

  const onAuth = async () => {
    toast({
      title: "Signing you in...",
      status: "loading",
      duration: 5000,
    });
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_VERCEL_URL
          ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
          : "http://localhost:3000" + (redirect ? redirect : ""),
      },
    });
    if (error) {
      toast({
        title: "Error signing in.",
        status: "error",
        duration: 2000,
      });
    }
    if (data) {
      toast({
        title: "Signed in!",
        status: "success",
        duration: 2000,
      });
      router.push(redirect as string);
    }
  };

  useEffect(() => {
    if (session) {
      console.log(session);
      router.push((redirect as string) ?? "/");
    }
  }, [session, redirect, router]);

  return (
    <Center height="full">
      <Button onClick={onAuth}>Sign in with Google</Button>
    </Center>
  );
}
