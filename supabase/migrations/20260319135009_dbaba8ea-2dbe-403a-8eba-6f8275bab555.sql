ALTER TABLE public.orders 
  ADD COLUMN free_vcf_ticket_new text NOT NULL DEFAULT 'no';

UPDATE public.orders SET free_vcf_ticket_new = CASE WHEN free_vcf_ticket = true THEN 'offered' ELSE 'no' END;

ALTER TABLE public.orders DROP COLUMN free_vcf_ticket;
ALTER TABLE public.orders RENAME COLUMN free_vcf_ticket_new TO free_vcf_ticket;