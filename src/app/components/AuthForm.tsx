"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, FileText, Upload, User2 } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { auth } from "@/app/firebase/client"
import { signUp, signIn } from "@/lib/auth.actions"
import { z } from "zod"

type FormType = "sign-in" | "sign-up"

interface AuthFormProps {
  type: FormType
}

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(type === "sign-up");
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
    toast.success(showPassword ? "Password hidden" : "Password visible", {
      duration: 2000,
      position: "bottom-center"
    })
  }

  const handleToggleSignUp = () => {
    setIsSignUp(!isSignUp)
    router.push(isSignUp ? "/signin" : "/signup")
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        const idToken = await result.user.getIdToken();
        await signIn({
          email: result.user.email!,
          idToken,
        });
        
        toast.success("Welcome! Signed in with Google successfully.");
        router.push("/");
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/popup-closed-by-user") {
          toast.error("Sign in cancelled. Please try again.");
        } else if (error.code === "auth/popup-blocked") {
          toast.error("Pop-up was blocked. Please allow pop-ups for this site.");
        } else {
          toast.error("Failed to sign in with Google. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Google sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const data = form.getValues();
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

          const result = await signUp({
            uid: userCredential.user.uid,
            name: name!,
            email,
            password,
          });

          if (!result.success) {
            toast.error(result.message || "Failed to create account. Please try again.");
            return;
          }

          toast.success("Account created successfully! Please sign in.");
          router.push("/signin");
        } catch (error) {
          if (error instanceof FirebaseError) {
            if (error.code === "auth/email-already-in-use") {
              toast.error("This email is already registered. Please sign in instead.");
            } else if (error.code === "auth/invalid-email") {
              toast.error("Please enter a valid email address.");
            } else if (error.code === "auth/weak-password") {
              toast.error("Password should be at least 6 characters long.");
            } else {
              toast.error("Failed to create account. Please try again.");
            }
          } else {
            toast.error("Failed to create account. Please try again.");
          }
          console.error("Sign up error:", error);
        }
      } else {
        const { email, password } = data;

        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );

          const idToken = await userCredential.user.getIdToken();
          if (!idToken) {
            toast.error("Sign in failed. Please try again.");
            return;
          }

          await signIn({
            email,
            idToken,
          });

          toast.success("Welcome back! Signed in successfully.");
          router.push("/");
        } catch (error) {
          if (error instanceof FirebaseError) {
            if (error.code === "auth/user-not-found") {
              toast.error("No account found with this email. Please sign up first.");
            } else if (error.code === "auth/wrong-password") {
              toast.error("Incorrect password. Please try again.");
            } else if (error.code === "auth/invalid-email") {
              toast.error("Please enter a valid email address.");
            } else if (error.code === "auth/too-many-requests") {
              toast.error("Too many failed attempts. Please try again later.");
            } else {
              toast.error("Failed to sign in. Please try again.");
            }
          } else {
            toast.error("Failed to sign in. Please try again.");
          }
          console.error("Sign in error:", error);
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 bg-gray-700/20 rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 sm:w-80 h-40 sm:h-80 bg-gray-600/20 rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-gray-800/10 rounded-full blur-2xl sm:blur-3xl"></div>
      </div>

      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-gray-900/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-700/30 relative overflow-hidden"
        >
          {/* Inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/10 to-transparent rounded-2xl sm:rounded-3xl"></div>

          <div className="text-center mb-6 sm:mb-8 relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent"
            >
              {isSignUp ? "Create Account" : "Welcome Back"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-gray-400 mt-2 text-sm sm:text-base"
            >
              {isSignUp ? "Join us today" : "Sign in to continue"}
            </motion.p>
          </div>

          <motion.button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2.5 sm:py-3 px-4 text-sm sm:text-base rounded-lg sm:rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-gray-900/50 relative overflow-hidden mb-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </div>
          </motion.button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700/50"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-3 sm:px-4 bg-transparent text-gray-500">or</span>
            </div>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-6 relative z-10"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.12 } },
              hidden: {},
            }}
          >
            {isSignUp && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4 }}
                className="space-y-2"
              >
                <label htmlFor="fullName" className="text-sm font-medium text-gray-300 block">
                  Full name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="fullName"
                    {...form.register("name")}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl bg-gray-900/40 border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your full name"
                    required
                  />
                  <User2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-6 text-gray-400" />
                </div>
              </motion.div>
            )}

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className="space-y-2"
            >
              <label htmlFor="email" className="text-sm font-medium text-gray-300 block">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  {...form.register("email")}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl bg-gray-900/40 border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Enter your email"
                  required
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-6 text-gray-400" />
              </div>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className="space-y-2"
            >
              <label htmlFor="password" className="text-sm font-medium text-gray-300 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...form.register("password")}
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl bg-gray-900/40 border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Enter your password"
                  required
                />
                <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-6 text-gray-400" />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            {isSignUp && (
              <>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4 }}
                  className="space-y-2"
                >
                  <label htmlFor="profilePic" className="text-sm font-medium text-gray-300 block">
                    Profile picture
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="profilePic"
                      accept="image/*"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl bg-gray-900/40 border border-gray-700/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 transition-all duration-300 backdrop-blur-sm 
                      file:mr-3 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-md sm:file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-gray-700/50 file:text-gray-200 hover:file:bg-gray-700/70 file:cursor-pointer"
                    />
                    <Upload className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-6 text-gray-400" />
                  </div>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4 }}
                  className="space-y-2"
                >
                  <label htmlFor="resume" className="text-sm font-medium text-gray-300 block">
                    Resume
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="resume"
                      accept="application/pdf"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl bg-gray-900/40 border border-gray-700/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 transition-all duration-300 backdrop-blur-sm 
                      file:mr-3 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-md sm:file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-gray-600/50 file:text-gray-200 hover:file:bg-gray-600/70 file:cursor-pointer"
                    />
                    <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-6 text-gray-400" />
                  </div>
                </motion.div>
              </>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 sm:py-3 lg:py-4 px-4 text-sm sm:text-base rounded-lg sm:rounded-xl bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white font-semibold hover:from-gray-700 hover:via-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-gray-900/50 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10">
                {isLoading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
              </span>
            </motion.button>
          </motion.form>

          <div className="mt-6 sm:mt-8 text-center relative z-10">
            <button
              onClick={handleToggleSignUp}
              disabled={isLoading}
              className="text-xs sm:text-sm text-gray-400 hover:text-gray-200 transition-colors duration-300 font-medium px-2 py-1 rounded hover:bg-gray-800/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AuthForm
