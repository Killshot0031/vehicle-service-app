import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function VehicleDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [vehicle, setVehicle] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (id) {
      fetchVehicle();
      fetchLogs();
    }
  }, [id]);

  async function fetchVehicle() {
    const { data } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();

    setVehicle(data);
  }

  async function fetchLogs() {
    const { data } = await supabase
      .from('service_logs')
      .select('*')
      .eq('vehicle_id', id)
      .order('created_at', { ascending: false });

    setLogs(data || []);
  }

  if (!vehicle) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>{vehicle.name}</h1>
      <p>{vehicle.year} {vehicle.make} {vehicle.model}</p>

      <h2>Recent Service</h2>
      {logs.map((log) => (
        <div key={log.id} className="log-card">
          <p><strong>{log.service_type}</strong></p>
          <p>Mileage: {log.mileage}</p>
          <p>{log.notes}</p>
        </div>
      ))}
    </div>
  );
}