import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env vars not configured.");
  return createClient(url, key);
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabase();
    const body = await req.json();
    const { name, mobile, email, message } = body;

    if (!name || !email || !message) {
      return Response.json(
        { success: false, message: "Missing required fields: name, email, message." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("contacts").insert([
      { name, mobile_no: mobile || null, email, message, source: "cli-portfolio" },
    ]);

    if (error) throw error;
    return Response.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ success: false, message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return Response.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ success: false, message }, { status: 500 });
  }
}
