"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import logoPic from "../public/img/logo.png";
import Cookies from 'js-cookie';
import Image from "next/image";

export default function LoginPage() {
  // const { push } = useRouter();
  const [error, setError] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn('google', { callbackUrl: 'http://localhost:3000/' });
    } catch (error) {
      console.error("Error pada proses sign in dengan Google:", error);
      setError("Gagal sign in dengan Google");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    setError("");
    setIsLoading(true);
    e.preventDefault();
  
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (res.status === 200) {
      // const data = await res.json();
      // Store the JWT token in localStorage or cookies
      // localStorage.setItem('token', data.token);
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.error || "Failed to login");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex w-full h-screen [@media(min-width:500px)]:h-full justify-center [@media(min-width:500px)]:px-6 [@media(min-width:500px)]:my-12s">
        <div className="w-full h-full [@media(min-width:500px)]:h-auto lg:h-[34.5rem] max-w-lg xl:w-3/4 lg:w-11/12 lg:max-w-4xl flex">
          <div
            className="w-full bg-gray-400 hidden lg:block lg:w-1/2 bg-cover rounded-l-xl"
            style={{ backgroundImage: "url('https://i.pinimg.com/736x/aa/d3/d6/aad3d691d8d8592bb8dd240de636f6a9.jpg')" }}
          />
          <div className="w-full h-full flex flex-col justify-center items-center lg:w-1/2 bg-white p-5 [@media(min-width:500px)]:rounded-xl lg:rounded-l-none">
          <Image
              src="/logo.png"
              alt="Logo"
              className="rounded-lg shadow-sm my-3 size-20 sm:size-16"
              width={100}
              height={100}
              priority
            />
            <h3 className="pt-4 font-bold text-2xl text-center text-neutral-800">Welcome Back!</h3>
            {error && <p className="text-red-600">{error}</p>}
            <form className="w-full px-3 md:px-8 pt-6 mb-4 bg-white rounded" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="email"
                  name="email" 
                  type="email"
                  placeholder="email"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="password">
                  Password
                </label>
                <input
                  className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="password"
                  name="password" 
                  type="password"
                  placeholder="******************"
                />
              </div>
              <div className="mb-6 text-center">
                <button
                  className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Sign In"}
                </button>
                <button
                  className="mt-5 w-full px-4 py-2 font-bold text-neutral-800 bg-slate-50 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                  type="button"
                  disabled={isLoading}
                  onClick={handleGoogleSignIn}
                >
                  <i className="fa-brands fa-google fa-xl mr-3"/>
                  {isLoading ? "Loading..." : "Sign In with Google"}
                </button>
              </div>
              <hr className="mb-6 border-t" />
              <div className="text-sm text-center text-neutral-800">
                Don{"'"}t have an account?{" "}
                <Link
                  className="inline-block font-semibold underline-offset-1 text-sm text-blue-500 align-baseline hover:text-blue-800"
                  href="/register"
                >
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
