import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function CarsPage() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('type', 'car')
      .order('created_at', { ascending: false });

    if (!error) setCars(data || []);
  }

  return (
    <div className="container">
      <h1>Cars</h1>

      <Link href="/add-vehicle">
        <button className="add-btn">Add Vehicle</button>
      </Link>

      {cars.map((car) => (
        <Link key={car.id} href={`/vehicle/${car.id}`}>
          <div className="vehicle-card">
            <h2>{car.name}</h2>
            <p>{car.year} {car.make} {car.model}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}