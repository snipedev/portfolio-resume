import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error: Missing Supabase credentials",
        },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const body = await request.json();

    const {
      name,
      email,
      company,
      projectDescription,
      servicesInterested,
      budgetRange,
      timeline,
    } = body;

    if (!name || !email || !projectDescription) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: name, email, projectDescription",
        },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
        },
        { status: 400 },
      );
    }

    console.log("Attempting to insert inquiry for:", email);

    const { data, error } = await supabase
      .from("freelancing_inquiries")
      .insert([
        {
          name,
          email,
          company: company || null,
          project_description: projectDescription,
          services_interested: servicesInterested || [],
          budget_range: budgetRange || null,
          timeline: timeline || null,
          status: "new",
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    console.log(`Successfully created inquiry from ${name} (${email})`);

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry submitted successfully. I will get back to you soon!",
        data: data?.[0] || null,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating freelancing inquiry:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to submit inquiry. Please try again or email directly.",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error: Missing Supabase credentials",
        },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await supabase
      .from("freelancing_inquiries")
      .select()
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        data: data || [],
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error retrieving freelancing inquiries:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to retrieve inquiries",
      },
      { status: 500 },
    );
  }
}

