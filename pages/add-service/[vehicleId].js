import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function AddService() {
  const router = useRouter();
  const { vehicleId } = router.query;

  const [serviceType, setServiceType] = useState('');
  const [mileage, setMileage] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    const { data, error } = await supabase
      .from('service_logs')
      .insert([
        {
          vehicle_id: vehicleId,
          service_type: serviceType,
          mileage: parseInt(mileage),
          cost: cost ? parseFloat(cost) : null,
          notes
        }
      ]);

    if (!error) {
      router.push(`/vehicle/${vehicleId}`);
    }
  }

  return (
    <div className="container">
      <h1>Add Service</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Service Type (Oil Change, Tires, etc.)"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Mileage"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Cost (optional)"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />

        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        
        <input
  type="text"
  placeholder="Technician Name"
  value={technician}
  onChange={(e) => setTechnician(e.target.value)}
  required
/>

        <button type="submit" className="add-btn">Save Service</button>
      </form>
    </div>
  );
}