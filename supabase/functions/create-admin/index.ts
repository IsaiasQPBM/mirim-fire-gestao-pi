
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
    console.log('🔧 Create admin function called');

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

    const adminEmail = 'admin@admin.com';
    const adminPassword = 'admin';

    console.log('👤 Creating/updating admin user:', adminEmail);

    // First, check if admin already exists in profiles
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role')
      .eq('email', adminEmail)
      .maybeSingle();

    if (existingProfile) {
      console.log('ℹ️ Admin profile already exists, checking auth user...');
      
      // Try to get the auth user
      const { data: authUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(existingProfile.id);
      
      if (authUser?.user) {
        console.log('✅ Admin user already exists and is functional');
        return new Response(
          JSON.stringify({ 
            message: 'Usuário administrador já existe e está funcional',
            email: adminEmail,
            password: adminPassword
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } else {
        // Auth user doesn't exist, but profile does - delete profile and recreate
        console.log('🔄 Profile exists but no auth user, cleaning up...');
        await supabaseAdmin.from('profiles').delete().eq('id', existingProfile.id);
      }
    }

    // Create admin user in auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Administrador Sistema',
        role: 'admin'
      }
    });

    if (authError) {
      console.error('❌ Auth error:', authError);
      
      // If user already exists error, try to update password
      if (authError.message?.includes('already exists') || authError.message?.includes('already registered')) {
        console.log('🔄 User exists, trying to update password...');
        
        // Get user by email first
        const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = userData.users?.find(u => u.email === adminEmail);
        
        if (existingUser) {
          // Update password
          const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            existingUser.id,
            { 
              password: adminPassword,
              email_confirm: true,
              user_metadata: {
                full_name: 'Administrador Sistema',
                role: 'admin'
              }
            }
          );
          
          if (updateError) {
            console.error('❌ Update error:', updateError);
            return new Response(
              JSON.stringify({ error: `Erro ao atualizar usuário: ${updateError.message}` }),
              { 
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            );
          }
          
          // Use updated user data
          authData.user = updateData.user;
          console.log('✅ Admin user password updated');
        } else {
          return new Response(
            JSON.stringify({ error: `Erro na criação do usuário: ${authError.message}` }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      } else {
        return new Response(
          JSON.stringify({ error: `Erro na criação do usuário: ${authError.message}` }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    if (!authData.user) {
      return new Response(
        JSON.stringify({ error: 'Falha ao criar usuário' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ Admin user processed:', authData.user.id);

    // Check if profile already exists for this user ID
    const { data: existingProfileById } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', authData.user.id)
      .maybeSingle();

    let profileData;

    if (existingProfileById) {
      // Update existing profile
      const { data: updateProfileData, error: updateProfileError } = await supabaseAdmin
        .from('profiles')
        .update({
          full_name: 'Administrador Sistema',
          email: adminEmail,
          role: 'admin',
          status: 'active'
        })
        .eq('id', authData.user.id)
        .select()
        .single();

      if (updateProfileError) {
        console.error('❌ Profile update error:', updateProfileError);
        return new Response(
          JSON.stringify({ error: `Falha ao atualizar perfil: ${updateProfileError.message}` }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      profileData = updateProfileData;
      console.log('✅ Admin profile updated');
    } else {
      // Create new profile
      const { data: createProfileData, error: createProfileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: 'Administrador Sistema',
          email: adminEmail,
          role: 'admin',
          status: 'active'
        })
        .select()
        .single();

      if (createProfileError) {
        console.error('❌ Profile creation error:', createProfileError);
        return new Response(
          JSON.stringify({ error: `Falha ao criar perfil: ${createProfileError.message}` }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      profileData = createProfileData;
      console.log('✅ Admin profile created');
    }

    return new Response(
      JSON.stringify({ 
        message: 'Usuário administrador configurado com sucesso',
        email: adminEmail,
        password: adminPassword,
        profile: profileData
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
