import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

export default function VehiclePage() {
  const router = useRouter();
  const { id } = router.query;

  const [vehicle, setVehicle] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (!id) return;
    loadVehicle();
    loadServices();
  }, [id]);

  async function loadVehicle() {
    const { data } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .single();

    setVehicle(data);
  }

  async function loadServices() {
    const { data } = await supabase
      .from("service_logs")
      .select("*")
      .eq("vehicle_id", id)
      .order("created_at", { ascending: false });

    setServices(data || []);
  }

  function formatDate(date) {
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  }

  return (
    <div className="container">
      {!vehicle ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>{vehicle.year} {vehicle.make} {vehicle.model}</h1>
          <p><strong>Type:</strong> {vehicle.type}</p>

          <button
            className="add-btn"
            onClick={() => router.push(`/add-service/${id}`)}
          >
            Add Service
          </button>

          <h2>Service History</h2>

          {services.length === 0 ? (
            <p>No services yet.</p>
          ) : (
            <div className="service-list">
              {services.map((s) => (
                <div key={s.id} className="service-card">
                  <p><strong>Service:</strong> {s.service_type}</p>
                  <p><strong>Mileage:</strong> {s.mileage}</p>
                  {s.cost && <p><strong>Cost:</strong> ${s.cost}</p>}
                  <p><strong>Technician:</strong> {s.technician_name}</p>
                  <p><strong>Date:</strong> {formatDate(s.created_at)}</p>
                  {s.notes && <p><strong>Notes:</strong> {s.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
