import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function TrucksPage() {
  const [trucks, setTrucks] = useState([]);

  useEffect(() => {
    fetchTrucks();
  }, []);

  async function fetchTrucks() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('type', 'truck');

    if (!error) setTrucks(data || []);
  }
  
  <Link href="/add-vehicle">
  <button className="add-btn">Add Vehicle</button>
</Link>

  return (
    <div className="container">
      <h1>Trucks</h1>

      {trucks.map((truck) => (
        <Link key={truck.id} href={`/vehicle/${truck.id}`}>
          <div className="vehicle-card">
            <h2>{truck.name}</h2>
            <p>{truck.year} {truck.make} {truck.model}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}