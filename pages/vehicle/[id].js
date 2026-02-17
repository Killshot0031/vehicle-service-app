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
    fetchVehicle();
    fetchServices();
  }, [id]);

  async function fetchVehicle() {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) setVehicle(data);
  }

  async function fetchServices() {
    const { data, error } = await supabase
      .from("service_logs")
      .select("*")
      .eq("vehicle_id", id)
      .order("created_at", { ascending: false });

    if (!error) setServices(data);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString("en-US", {
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
          <p><strong>VIN:</strong> {vehicle.vin || "N/A"}</p>

          <button
            className="add-btn"
            onClick={() => router.push(`/add-service/${id}`)}
          >
            Add Service
          </button>

          <h2>Service History</h2>

          {services.length === 0 ? (
            <p>No service records yet.</p>
          ) : (
            <div className="service-list">
              {services.map((service) => (
                <div key={service.id} className="service-card">
                  <p><strong>Service:</strong> {service.service_type}</p>
                  <p><strong>Mileage:</strong> {service.mileage}</p>
                  {service.cost && (
                    <p><strong>Cost:</strong> ${service.cost}</p>
                  )}
                  <p><strong>Technician:</strong> {service.technician_name}</p>
                  <p><strong>Date:</strong> {formatDate(service.created_at)}</p>
                  {service.notes && (
                    <p><strong>Notes:</strong> {service.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
