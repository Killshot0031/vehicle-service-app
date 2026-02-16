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
      .eq('type', 'truck')
      .order('created_at', { ascending: false });

    if (!error) {
      setTrucks(data || []);
    }
  }

  return (
    <div className="container">
      <h1>Trucks</h1>

      {/* Add Vehicle Button */}
      <Link href="/add-vehicle">
        <button className="add-btn">Add Vehicle</button>
      </Link>

      {trucks.length === 0 && (
        <p>No trucks found. Add one to get started.</p>
      )}

      {trucks.map((truck) => (
        <Link key={truck.id} href={`/vehicle/${truck.id}`}>
          <div className="vehicle-card">
            <h2>{truck.name}</h2>
            <p>{truck.year} {truck.make} {truck.model}</p>

            {truck.type && (
              <p style={{ opacity: 0.7 }}>Type: {truck.type}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}