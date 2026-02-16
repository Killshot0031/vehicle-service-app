import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    fetchEquipment();
  }, []);

  async function fetchEquipment() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('type', 'equipment')
      .order('created_at', { ascending: false });

    if (!error) setEquipment(data || []);
  }

  return (
    <div className="container">
      <h1>Equipment</h1>

      <Link href="/add-vehicle">
        <button className="add-btn">Add Vehicle</button>
      </Link>

      {equipment.map((item) => (
        <Link key={item.id} href={`/vehicle/${item.id}`}>
          <div className="vehicle-card">
            <h2>{item.name}</h2>
            <p>{item.year} {item.make} {item.model}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}