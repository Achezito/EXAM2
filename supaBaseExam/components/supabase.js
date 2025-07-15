import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rtwcoftbxtqnpheakuuu.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0d2NvZnRieHRxbnBoZWFrdXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NDU5MjMsImV4cCI6MjA2ODEyMTkyM30.ZmZ69YPEoNVA2r6x8zbkdYvUgO-PnaOrjmrNgEKGbWM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
