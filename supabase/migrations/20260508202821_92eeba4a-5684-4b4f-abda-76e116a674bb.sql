ALTER TABLE public.orders ADD COLUMN edition date NOT NULL DEFAULT '2026-06-30';
UPDATE public.orders SET edition = '2026-04-16' WHERE created_at < now();
ALTER TABLE public.orders ALTER COLUMN edition SET DEFAULT '2026-06-30';