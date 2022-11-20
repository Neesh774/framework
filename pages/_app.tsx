// pages/_app.js
import { ChakraProvider, Stack } from "@chakra-ui/react";
import { AppProps } from "next/app";
import MetaTags from "../components/MetaTags";
import theme from "../utils/theme";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import Nav from "../components/Nav";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [showRounds, setShowRounds] = useState(false);

  return (
    <>
      <MetaTags title="Framework" />
      <SessionContextProvider
        supabaseClient={supabase}
        initialSession={pageProps.initialSession}
      >
        <ChakraProvider theme={theme}>
          <Stack height="100vh" dir="column">
            <Nav showRounds={showRounds} setShowRounds={setShowRounds} />
            <Component {...pageProps} showRounds={showRounds} />
          </Stack>
        </ChakraProvider>
      </SessionContextProvider>
    </>
  );
}

export default MyApp;
