import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="navbar">
      <Link href="/">Home</Link>
      <Link href="/trucks">Trucks</Link>
      <Link href="/cars">Cars</Link>
      <Link href="/equipment">Equipment</Link>
      <Link href="/add-vehicle" className="add-link">Add Vehicle</Link>
    </nav>
  );
}

<button
  className="logout-btn"
  onClick={async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }}
>
  Logout
</button>