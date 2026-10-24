-- =====================================================================================
-- KAAMCONNECT: SEED DATA FOR DEMO AND PRODUCTION
-- =====================================================================================

-- Insert Default Services
INSERT INTO public.services (id, name, category, description, icon_name, base_price_estimate) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Electrician', 'Electrical', 'Switchboard wiring, ceiling fans, short circuits & MCB installation.', 'Zap', 399.00),
  ('11111111-1111-1111-1111-111111111102', 'Plumber', 'Plumbing', 'Pipe leaks, tap replacements, toilet cisterns & drain unclogging.', 'Wrench', 349.00),
  ('11111111-1111-1111-1111-111111111103', 'Carpenter', 'Carpentry', 'Door locks, hinge repairs, custom shelves & flatpack assembly.', 'Hammer', 449.00),
  ('11111111-1111-1111-1111-111111111104', 'House Cleaning', 'Cleaning', 'Deep bathroom cleaning, kitchen degreasing & full home sanitization.', 'Sparkles', 699.00),
  ('11111111-1111-1111-1111-111111111105', 'Painting & Waterproofing', 'Painting', 'Interior wall touch-ups, moisture sealing & texture painting.', 'Paintbrush', 799.00),
  ('11111111-1111-1111-1111-111111111106', 'Appliance Repair', 'Appliances', 'Washing machines, microwave ovens, refrigerators & AC service.', 'Cpu', 499.00),
  ('11111111-1111-1111-1111-111111111107', 'Home Cook / Chef', 'Cooking', 'Hygienic daily North/South Indian meals & breakfast prep.', 'Utensils', 450.00),
  ('11111111-1111-1111-1111-111111111108', 'Maid & Domestic Help', 'Domestic', 'Sweeping, mopping, utensil washing, dusting & laundry folding.', 'Home', 300.00)
ON CONFLICT (name) DO NOTHING;
