import { useState, useEffect } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Brain, Mail, Lock, User, Loader2, AtSign } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Validate username format if provided
    if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
      toast.error("Username can only contain letters, numbers, and underscores");
      return;
    }

    setIsSubmitting(true);
    
    const { error } = await signUp(email, password, fullName, username || undefined);
    
    if (error) {
      toast.error(error.message);
      setIsSubmitting(false);
    } else {
      toast.success("Registration successful! Please sign in to continue.");
      navigate("/login");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      setIsGoogleLoading(true);
      const { error } = await signInWithGoogle(credentialResponse.credential);
      if (error) {
        toast.error(error.message || "Failed to sign in with Google");
      }
      setIsGoogleLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 tech-gradient opacity-10" />
      
      <Card className="w-full max-w-md relative z-10 tech-glow">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full tech-gradient">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Join Techtronia</CardTitle>
          <CardDescription>
            Create your account and start your AI-powered learning adventure
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google login failed")}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or register with email</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isSubmitting || isGoogleLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username (optional)</Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a unique username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                  className="pl-10"
                  disabled={isSubmitting || isGoogleLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground">Letters, numbers, and underscores only</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isSubmitting || isGoogleLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isSubmitting || isGoogleLoading}
                  minLength={6}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full tech-gradient" disabled={isSubmitting || isGoogleLoading}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
