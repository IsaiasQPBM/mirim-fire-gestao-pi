
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Create user function called');

    // Create Supabase admin client using service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { email, password, fullName, role, phone, birthDate } = await req.json();

    console.log('📝 Creating user:', { email, role, fullName });

    // Validate required fields
    if (!email || !password || !fullName || !role) {
      console.error('❌ Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Email, password, full name and role are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate role
    const validRoles = ['admin', 'instructor', 'student'];
    if (!validRoles.includes(role)) {
      console.error('❌ Invalid role:', role);
      return new Response(
        JSON.stringify({ error: 'Invalid role. Must be admin, instructor, or student' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create user in auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: role,
        phone: phone,
        birth_date: birthDate
      }
    });

    if (authError) {
      console.error('❌ Auth error:', authError);
      return new Response(
        JSON.stringify({ error: authError.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ User created in auth:', authData.user?.id);

    // Create profile in profiles table
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: fullName,
        email: email,
        phone: phone,
        birth_date: birthDate,
        role: role,
        status: 'active'
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Profile creation error:', profileError);
      
      // If profile creation fails, clean up auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      
      return new Response(
        JSON.stringify({ error: `Failed to create profile: ${profileError.message}` }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ Profile created:', profileData);

    // If it's a student, also create student record
    if (role === 'student') {
      const registrationNumber = `EST${Date.now()}`;
      
      const { error: studentError } = await supabaseAdmin
        .from('students')
        .insert({
          user_id: authData.user.id,
          registration_number: registrationNumber,
          birth_date: birthDate,
          phone: phone,
          status: 'active',
          enrollment_date: new Date().toISOString().split('T')[0]
        });

      if (studentError) {
        console.error('⚠️ Student record creation error:', studentError);
        // Don't fail the whole process, just log the error
      } else {
        console.log('✅ Student record created with registration:', registrationNumber);
      }
    }

    return new Response(
      JSON.stringify({ 
        user: authData.user,
        profile: profileData,
        message: 'User created successfully'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
