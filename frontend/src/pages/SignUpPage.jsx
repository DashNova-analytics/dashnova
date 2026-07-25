import React from 'react';
import SignUp from '../components/clerk/SignUp';
import { useNavigate } from 'react-router-dom';

export default function SignUpPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-6 font-sans antialiased">
      {/* Brand logo */}
      <div className="mb-5 flex items-center">
        <img
          src="/logo1.png"
          alt="DashNova logo"
          className="w-10 h-10 rounded object-cover shrink-0"
        />
        <span className="font-bold text-lg tracking-tight text-gray-950">DASHNOVA</span>
      </div>

      <SignUp onToggleSignIn={() => navigate('/signin')} />

      <div className="mt-12 text-[10px] text-gray-400 font-medium tracking-tight">
        Protected by Enterprise Authentication
      </div>
    </div>
  );
}
