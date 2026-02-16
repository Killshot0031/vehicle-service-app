import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function AddVehicle() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('truck');

  async function handleSubmit(e) {
    e.preventDefault();

    const { data, error } = await supabase
      .from('vehicles')
      .insert([
        {
          name,
          year: parseInt(year),
          make,
          model,
          type
        }
      ]);

    if (!error) {
      router.push('/');
    }
  }

  return (
    <div className="container">
      <h1>Add Vehicle</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Vehicle Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Make"
          value={make}
          onChange={(e) => setMake(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          required
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="truck">Truck</option>
          <option value="car">Car</option>
          <option value="equipment">Equipment</option>
        </select>

        <button type="submit">Add Vehicle</button>
      </form>
    </div>
  );
}