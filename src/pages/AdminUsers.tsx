import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, ShieldOff, LogOut, Search } from "lucide-react";

interface ProfileRow {
  id: string;
  email: string | null;
  nombre: string | null;
}

const AdminUsers = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [adminIds, setAdminIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const [{ data: profs }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, email, nombre"),
      supabase.from("user_roles").select("user_id").eq("role", "admin"),
    ]);
    setProfiles(profs ?? []);
    setAdminIds(new Set((roles ?? []).map((r: { user_id: string }) => r.user_id)));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const promote = async (userId: string) => {
    setBusy(userId);
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    setBusy(null);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setAdminIds((prev) => new Set(prev).add(userId));
    toast({ title: "Usuario promovido", description: "Ahora es administrador." });
  };

  const demote = async (userId: string) => {
    if (userId === user?.id) {
      toast({ title: "Acción no permitida", description: "No puedes quitarte el rol a ti mismo.", variant: "destructive" });
      return;
    }
    setBusy(userId);
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
    setBusy(null);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setAdminIds((prev) => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
    toast({ title: "Rol revocado" });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login", { replace: true });
  };

  const filtered = profiles.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.email?.toLowerCase().includes(q) || p.nombre?.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Panel de Administración</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">Ir a la tienda</Link>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">Gestión de usuarios y roles</h2>
          <p className="text-muted-foreground text-sm">
            Promueve usuarios a administradores o revoca sus permisos.
          </p>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="text-left text-sm">
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Rol</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Cargando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Sin resultados</td></tr>
              ) : filtered.map((p) => {
                const isAdmin = adminIds.has(p.id);
                const isSelf = p.id === user?.id;
                return (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-4 py-3">{p.nombre ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.email ?? "—"}</td>
                    <td className="px-4 py-3">
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                          <ShieldCheck className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Usuario</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isAdmin ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={busy === p.id || isSelf}
                          onClick={() => demote(p.id)}
                        >
                          <ShieldOff className="w-4 h-4 mr-2" />
                          {isSelf ? "Tú" : "Revocar"}
                        </Button>
                      ) : (
                        <Button
                          variant="hero"
                          size="sm"
                          disabled={busy === p.id}
                          onClick={() => promote(p.id)}
                        >
                          <ShieldCheck className="w-4 h-4 mr-2" />
                          Promover
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          ℹ️ El primer administrador debe ser asignado manualmente desde el backend (tabla <code>user_roles</code>).
        </p>
      </main>
    </div>
  );
};

export default AdminUsers;
