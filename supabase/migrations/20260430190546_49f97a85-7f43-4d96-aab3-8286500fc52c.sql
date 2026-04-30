-- Enum para los planes
CREATE TYPE public.course_plan AS ENUM ('basico', 'intermedio', 'pro');

-- Enum para el estado
CREATE TYPE public.enrollment_status AS ENUM ('pendiente', 'confirmada', 'cancelada');

CREATE TABLE public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  plan public.course_plan NOT NULL,
  notas TEXT,
  status public.enrollment_status NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede inscribirse (incluso sin login)
CREATE POLICY "Anyone can submit enrollment"
ON public.course_enrollments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Solo admins pueden ver
CREATE POLICY "Admins can view enrollments"
ON public.course_enrollments
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Solo admins pueden actualizar
CREATE POLICY "Admins can update enrollments"
ON public.course_enrollments
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Solo admins pueden eliminar
CREATE POLICY "Admins can delete enrollments"
ON public.course_enrollments
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Trigger updated_at
CREATE TRIGGER set_course_enrollments_updated_at
BEFORE UPDATE ON public.course_enrollments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();