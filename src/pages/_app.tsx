import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import type { AppProps } from "next/app";
import { Url } from "next/dist/shared/lib/router/router";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "../components/Loading";
import { auth, db } from "../config/firebase";
import Login from "./login";

export default function App({ Component, pageProps }: AppProps) {
  const [loggedInUser, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const setUserInDb = async () => {
      await setDoc(
        doc(db, "users", loggedInUser?.email as string),
        {
          email: loggedInUser?.email,
          lastSeen: serverTimestamp(),
          avt: loggedInUser?.photoURL,
        },
        { merge: true }
      );
    };
    if (loggedInUser) {
      setUserInDb();
    }
  }, [loggedInUser]);

  if (loading) return <Loading />;
  if (!loggedInUser) return <Login />;
  return <Component {...pageProps} />;
}
