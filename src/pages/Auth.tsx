import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import logoIcon from "@/assets/logo-icon.png";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Email inválido" }).max(255),
  password: z.string().min(6, { message: "Mínimo 6 caracteres" }).max(72),
});

const signupSchema = loginSchema.extend({
  nombre: z.string().trim().min(2, { message: "Mínimo 2 caracteres" }).max(100),
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ nombre: "", email: "", password: "" });

  useEffect(() => {
    if (!loading && user) navigate("/productos", { replace: true });
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse(loginData);
    if (!parsed.success) {
      toast({ title: "Datos inválidos", description: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setSubmitting(false);
    if (error) {
      toast({ title: "Error de inicio de sesión", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "¡Bienvenido!", description: "Sesión iniciada correctamente" });
    navigate("/productos", { replace: true });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signupSchema.safeParse(signupData);
    if (!parsed.success) {
      toast({ title: "Datos inválidos", description: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/productos`,
        data: { nombre: parsed.data.nombre },
      },
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error al registrarse", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "¡Cuenta creada!", description: "Ya puedes iniciar sesión" });
    navigate("/productos", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary to-primary/80 p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <img src={logoIcon} alt="PEQUE_SHOP" className="w-10 h-10" />
          <span className="text-2xl font-bold text-primary-foreground tracking-tight">PEQUE_SHOP</span>
        </Link>

        <div className="bg-card border border-border rounded-xl shadow-2xl p-8">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
              <TabsTrigger value="signup">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <h1 className="text-2xl font-bold text-card-foreground mb-1">Bienvenido de nuevo</h1>
              <p className="text-muted-foreground text-sm mb-6">Ingresa para continuar tu compra</p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Contraseña</Label>
                  <Input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" variant="hero" className="w-full" disabled={submitting}>
                  {submitting ? "Ingresando..." : "Iniciar sesión"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <h1 className="text-2xl font-bold text-card-foreground mb-1">Crea tu cuenta</h1>
              <p className="text-muted-foreground text-sm mb-6">Únete a PEQUE_SHOP</p>
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="signup-nombre">Nombre</Label>
                  <Input
                    id="signup-nombre"
                    value={signupData.nombre}
                    onChange={(e) => setSignupData({ ...signupData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password">Contraseña</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    autoComplete="new-password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" variant="hero" className="w-full" disabled={submitting}>
                  {submitting ? "Creando..." : "Crear cuenta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-primary-foreground/70 text-sm mt-6">
          <Link to="/" className="hover:text-gold transition-colors">← Volver al inicio</Link>
        </p>
      </div>
    </div>
  );
};

export default Auth;
