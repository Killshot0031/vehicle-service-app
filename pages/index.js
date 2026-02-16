import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [serviceLogs, setServiceLogs] = useState([]);

  const [vehicleForm, setVehicleForm] = useState({
    name: '',
    year: '',
    make: '',
    model: '',
    vin: '',
  });

  const [serviceForm, setServiceForm] = useState({
    service_type: '',
    mileage: '',
    cost: '',
    notes: '',
    service_date: '',
  });

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setLoading(false);
    };
    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchVehicles();
    }
  }, [session]);

  useEffect(() => {
    if (selectedVehicleId) {
      fetchServiceLogs(selectedVehicleId);
    } else {
      setServiceLogs([]);
    }
  }, [selectedVehicleId]);

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
  };

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) alert(error.message);
    else alert('Account created. You can now log in.');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setVehicles([]);
    setSelectedVehicleId(null);
    setServiceLogs([]);
  };

  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error) {
      setVehicles(data);
      if (data.length && !selectedVehicleId) {
        setSelectedVehicleId(data[0].id);
      }
    }
  };

  const fetchServiceLogs = async (vehicleId) => {
    const { data, error } = await supabase
      .from('service_logs')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('service_date', { ascending: false });

    if (!error) {
      setServiceLogs(data);
    }
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicleForm.name) return;

    const { data, error } = await supabase.from('vehicles').insert([
      {
        name: vehicleForm.name,
        year: vehicleForm.year ? Number(vehicleForm.year) : null,
        make: vehicleForm.make || null,
        model: vehicleForm.model || null,
        vin: vehicleForm.vin || null,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setVehicleForm({
      name: '',
      year: '',
      make: '',
      model: '',
      vin: '',
    });

    fetchVehicles();
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicleId) {
      alert('Select a vehicle first.');
      return;
    }
    if (!serviceForm.service_type || !serviceForm.mileage) {
      alert('Service type and mileage are required.');
      return;
    }

    const { error } = await supabase.from('service_logs').insert([
      {
        vehicle_id: selectedVehicleId,
        service_type: serviceForm.service_type,
        mileage: Number(serviceForm.mileage),
        cost: serviceForm.cost ? Number(serviceForm.cost) : null,
        notes: serviceForm.notes || null,
        service_date: serviceForm.service_date || null,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setServiceForm({
      service_type: '',
      mileage: '',
      cost: '',
      notes: '',
      service_date: '',
    });

    fetchServiceLogs(selectedVehicleId);
  };

  if (loading) return null;

  if (!session) {
    return (
      <div className="app-container">
        <div className="card">
          <div className="header">
            <div className="title">
              <span className="red">Garage</span> Tracker
            </div>
            <div className="badge">Vehicle Service • Cloud</div>
          </div>

          <p className="small" style={{ marginBottom: 16 }}>
            Log in or create an account to track service for multiple vehicles.
          </p>

          <div className="grid" style={{ gap: 12, marginBottom: 12 }}>
            <input
              className="input"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="button" onClick={signIn}>
              Log In
            </button>
            <button className="button secondary" onClick={signUp}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="card">
        <div className="header">
          <div>
            <div className="title">
              <span className="red">Garage</span> Tracker
            </div>
            <div className="small">Signed in as {session.user.email}</div>
          </div>
          <button className="button secondary" onClick={signOut}>
            Sign Out
          </button>
        </div>

        <div className="grid grid-2">
          {/* Left: Vehicles */}
          <div>
            <div className="section-title">Vehicles</div>
            <div className="list" style={{ marginBottom: 12 }}>
              {vehicles.length === 0 && (
                <div className="small">No vehicles yet. Add one below.</div>
              )}
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className={
                    'vehicle-card' +
                    (v.id === selectedVehicleId ? ' active' : '')
                  }
                  onClick={() => setSelectedVehicleId(v.id)}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {v.name || 'Vehicle'}
                    </div>
                    <div className="small">
                      {[v.year, v.make, v.model].filter(Boolean).join(' ')}
                    </div>
                  </div>
                  {v.vin && <div className="tag">VIN: {v.vin}</div>}
                </div>
              ))}
            </div>

            <form onSubmit={handleVehicleSubmit} className="grid">
              <div className="section-title">Add Vehicle</div>
              <input
                className="input"
                placeholder="Nickname (e.g. Daily Driver)"
                value={vehicleForm.name}
                onChange={(e) =>
                  setVehicleForm({ ...vehicleForm, name: e.target.value })
                }
              />
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input
                  className="input"
                  placeholder="Year"
                  value={vehicleForm.year}
                  onChange={(e) =>
                    setVehicleForm({ ...vehicleForm, year: e.target.value })
                  }
                />
                <input
                  className="input"
                  placeholder="Make"
                  value={vehicleForm.make}
                  onChange={(e) =>
                    setVehicleForm({ ...vehicleForm, make: e.target.value })
                  }
                />
              </div>
              <input
                className="input"
                placeholder="Model"
                value={vehicleForm.model}
                onChange={(e) =>
                  setVehicleForm({ ...vehicleForm, model: e.target.value })
                }
              />
              <input
                className="input"
                placeholder="VIN (optional)"
                value={vehicleForm.vin}
                onChange={(e) =>
                  setVehicleForm({ ...vehicleForm, vin: e.target.value })
                }
              />
              <button className="button" type="submit">
                Add Vehicle
              </button>
            </form>
          </div>

          {/* Right: Service logs */}
          <div>
            <div className="section-title">Service History</div>
            <div className="list" style={{ marginBottom: 12 }}>
              {selectedVehicleId && serviceLogs.length === 0 && (
                <div className="small">
                  No service logs yet for this vehicle.
                </div>
              )}
              {!selectedVehicleId && (
                <div className="small">Select a vehicle to view history.</div>
              )}
              {serviceLogs.map((log) => (
                <div key={log.id} className="list-item">
                  <div style={{ fontWeight: 600 }}>
                    {log.service_type}{' '}
                    <span className="small">
                      • {log.service_date || 'No date'}
                    </span>
                  </div>
                  <div className="small">
                    Mileage: {log.mileage}
                    {log.cost != null && ` • $${log.cost}`}
                  </div>
                  {log.notes && (
                    <div className="small" style={{ marginTop: 4 }}>
                      {log.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleServiceSubmit} className="grid">
              <div className="section-title">Add Service</div>
              <input
                className="input"
                placeholder="Service type (e.g. Oil Change)"
                value={serviceForm.service_type}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    service_type: e.target.value,
                  })
                }
              />
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input
                  className="input"
                  placeholder="Mileage"
                  value={serviceForm.mileage}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      mileage: e.target.value,
                    })
                  }
                />
                <input
                  className="input"
                  placeholder="Cost (optional)"
                  value={serviceForm.cost}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      cost: e.target.value,
                    })
                  }
                />
              </div>
              <input
                className="input"
                type="date"
                value={serviceForm.service_date}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    service_date: e.target.value,
                  })
                }
              />
              <textarea
                className="textarea"
                rows={3}
                placeholder="Notes (optional)"
                value={serviceForm.notes}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    notes: e.target.value,
                  })
                }
              />
              <button className="button" type="submit">
                Save Service
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}