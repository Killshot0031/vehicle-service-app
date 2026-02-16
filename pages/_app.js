import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <div className="tabs">
        <a href="/">All</a>
        <a href="/trucks">Trucks</a>
      </div>
      <Component {...pageProps} />
    </>
  );
}