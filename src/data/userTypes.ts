import { supabase } from '@/lib/supabase';

export type UserRole = 'admin' | 'instructor' | 'student';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface UserPermission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

// Busca usuário por ID
export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return {
    id: data.id,
    fullName: data.full_name,
    email: data.email,
    role: data.role as UserRole,
  };
}

// Busca permissões por role
export async function getPermissionsByRole(role: UserRole): Promise<UserPermission[]> {
  const { data, error } = await supabase
    .from('permissions')
    .select('id, name, description, enabled')
    .eq('role', role);
  if (error || !data) return [];
  return data.map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    enabled: p.enabled,
  }));
} 