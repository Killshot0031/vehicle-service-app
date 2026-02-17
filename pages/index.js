import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchVehicles();
    fetchServiceHistory();
  }, []);

  async function fetchVehicles() {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setVehicles(data || []);
  }

  async function fetchServiceHistory() {
    const { data, error } = await supabase
      .from("service_logs")
      .select("vehicle_id, created_at")
      .order("created_at", { ascending: false });

    if (!error) setServices(data || []);
  }

  function getLastServiceDate(vehicleId) {
    const record = services.find((s) => s.vehicle_id === vehicleId);
    if (!record) return "No service yet";
    return new Date(record.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  return (
    <div className="container">
      <h1>All Vehicles</h1>

      <Link href="/add-vehicle">
        <button className="add-btn">Add Vehicle</button>
      </Link>

      {vehicles.length === 0 ? (
        <p>No vehicles found.</p>
      ) : (
        <div className="vehicle-list">
          {vehicles.map((v) => (
            <Link key={v.id} href={`/vehicle/${v.id}`}>
              <div className="vehicle-card">
                <h2>{v.year} {v.make} {v.model}</h2>
                <p style={{ opacity: 0.7 }}>Type: {v.type}</p>
                <p><strong>Last Service:</strong> {getLastServiceDate(v.id)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
