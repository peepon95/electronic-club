import { createClient } from "@supabase/supabase-js";
import { siteConfig } from "./config";

const { supabaseUrl, supabasePublishableKey } = siteConfig;

export const supabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null;
