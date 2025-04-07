
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import AuthForm from "@/components/AuthForm";

const AuthPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Redirect authenticated users to appropriate page
  React.useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, isAdmin, navigate]);

  return (
    <Layout>
      <div className="max-container py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-display font-bold mb-8 text-center">Sign In to Your Account</h1>
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <AuthForm onSuccess={() => isAdmin ? navigate("/admin") : navigate("/")} />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AuthPage;
