import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignup(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push('/login');
  }

  return (
    <div className="container">
      <h1>Sign Up</h1>

      <form onSubmit={handleSignup} className="form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}