import React, { useState } from "react";
import { auth, provider } from "../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  const signGoogle = async () => {
    setLoading(true);
    try {
      if (isLogin) {
        const userCredential = await signInWithPopup(auth, provider);
        setUser(userCredential.user);
      } 
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  





  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 w-[90%] max-w-md text-white">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          {user ? "Welcome 🎉" : isLogin ? "Login" : "Create Account"}
        </h2>

        {user ? (
          <div className="text-center">
            <p className="mb-4">You’re logged in as <span className="font-bold">{user.email}</span></p>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 w-full py-2 rounded-lg font-semibold"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-4 px-4 py-2 rounded-lg bg-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mb-6 px-4 py-2 rounded-lg bg-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleAuth}
              disabled={loading}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all"
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
            </button>
            <button
          onClick={signGoogle}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>

            <p className="text-center mt-4 text-sm text-gray-300">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-300 font-medium ml-2 hover:underline"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
