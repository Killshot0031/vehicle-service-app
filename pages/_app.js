import { useEffect } from "react";
import "../styles/globals.css";
import NavBar from "../components/NavBar";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return (
    <>
      <NavBar />
      <Component {...pageProps} />
    </>
  );
}