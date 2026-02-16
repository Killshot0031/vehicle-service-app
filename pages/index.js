import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function Home() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  async function fetchVehicles() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setVehicles(data || []);
    }
  }

  return (
    <div className="container">
      <h1>All Vehicles</h1>

      {vehicles.length === 0 && (
        <p>No vehicles found. Add one to get started.</p>
      )}

      {vehicles.map((vehicle) => (
        <Link key={vehicle.id} href={`/vehicle/${vehicle.id}`}>
          <div className="vehicle-card">
            <h2>{vehicle.name}</h2>
            <p>{vehicle.year} {vehicle.make} {vehicle.model}</p>

            {vehicle.type && (
              <p style={{ opacity: 0.7 }}>Type: {vehicle.type}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}