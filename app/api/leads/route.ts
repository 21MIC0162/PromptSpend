import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/db/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      email,
      companyName,
      role,
      auditId,
      honeypot,
    } = body;

    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          email,
          company: companyName,
          role,
          audit_id: auditId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      {
        status: 500,
      }
    );
  }
}