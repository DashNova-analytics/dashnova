import React from 'react';
import SignIn from '../components/clerk/SignIn';
import { useNavigate } from 'react-router-dom';

export default function SignInPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-6 font-sans antialiased">
      {/* Brand logo */}
      <div className="mb-8 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded bg-black flex items-center justify-center text-white font-bold text-xs shrink-0">
          D
        </div>
        <span className="font-bold text-lg tracking-tight text-gray-950">DASHNOVA</span>
      </div>

      <SignIn onToggleSignUp={() => navigate('/signup')} />

      <div className="mt-12 text-[10px] text-gray-400 font-medium tracking-tight">
        Protected by Enterprise Authentication
      </div>
    </div>
  );
}
