// These values are public by design: Vite includes them in the browser bundle even
// when they come from environment variables. Keeping the live defaults here makes
// static deployments work when the host has not been given a local .env file.
// Environment variables still take precedence, so preview/staging deployments can
// point at different resources without changing source code.
const publicDefault = (value, fallback) => value?.trim() || fallback;

export const siteConfig = {
  supabaseUrl: publicDefault(
    import.meta.env.VITE_SUPABASE_URL,
    "https://zleebabvjvupwdbalhiq.supabase.co",
  ),
  supabasePublishableKey: publicDefault(
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    "sb_publishable_jiCEPF_SarrrvaClvPaJPA_wCweFS06",
  ),
  guides: {
    cyberdeckPart1: publicDefault(
      import.meta.env.VITE_CYBERDECK_PART_1_GUIDE_URL,
      "https://docs.google.com/document/d/1S_SVy_4Ljr6eFPE0JEncSYb0zxt9x5WTVBxW6fl7OA0/edit?tab=t.0",
    ),
    cyberdeckPart2: import.meta.env.VITE_CYBERDECK_PART_2_GUIDE_URL?.trim(),
  },
};
