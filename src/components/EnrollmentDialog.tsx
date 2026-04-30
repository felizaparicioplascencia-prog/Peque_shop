import { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type CoursePlan = "basico" | "intermedio" | "pro";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: CoursePlan | null;
  planLabel: string;
}

const schema = z.object({
  nombre: z.string().trim().min(2, "Nombre muy corto").max(100, "Máx 100 caracteres"),
  email: z.string().trim().email("Email inválido").max(255),
  telefono: z.string().trim().max(30).optional().or(z.literal("")),
  notas: z.string().trim().max(500).optional().or(z.literal("")),
});

const EnrollmentDialog = ({ open, onOpenChange, plan, planLabel }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", notas: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Datos inválidos", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("course_enrollments").insert({
      nombre: parsed.data.nombre,
      email: parsed.data.email,
      telefono: parsed.data.telefono || null,
      notas: parsed.data.notas || null,
      plan,
    });
    setLoading(false);

    if (error) {
      toast({ title: "Error al inscribir", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "¡Inscripción enviada!", description: "Te contactaremos pronto para confirmar." });
    setForm({ nombre: "", email: "", telefono: "", notas: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inscripción — {planLabel}</DialogTitle>
          <DialogDescription>Completa tus datos y nos pondremos en contacto contigo.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre completo *</Label>
            <Input id="nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required maxLength={100} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required maxLength={255} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono (opcional)</Label>
            <Input id="telefono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} maxLength={30} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notas">Comentarios (opcional)</Label>
            <Textarea id="notas" value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} maxLength={500} rows={3} />
          </div>
          <Button type="submit" variant="hero" className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar inscripción"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentDialog;
