import { supabase } from '@/lib/supabase';

export const cmsContentService = {
  async getAll() {
    const { data, error } = await supabase.from('cms_content').select('*').order('order_index', { ascending: true });
    if (error) throw error;
    return data;
  },
  async getById(id) {
    const { data, error } = await supabase.from('cms_content').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(data) {
    const { data: result, error } = await supabase.from('cms_content').insert([data]).select().single();
    if (error) throw error;
    return result;
  },
  async update(id, data) {
    const { data: result, error } = await supabase.from('cms_content').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
  },
  async remove(id) {
    const { error } = await supabase.from('cms_content').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};

export const cmsMenusService = {
  async getAll() {
    const { data, error } = await supabase.from('cms_menus').select('*').order('order_index', { ascending: true });
    if (error) throw error;
    return data;
  },
  async getById(id) {
    const { data, error } = await supabase.from('cms_menus').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(data) {
    const { data: result, error } = await supabase.from('cms_menus').insert([data]).select().single();
    if (error) throw error;
    return result;
  },
  async update(id, data) {
    const { data: result, error } = await supabase.from('cms_menus').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
  },
  async remove(id) {
    const { error } = await supabase.from('cms_menus').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};

export const cmsContactService = {
  async getAll() {
    const { data, error } = await supabase.from('cms_contact').select('*').order('order_index', { ascending: true });
    if (error) throw error;
    return data;
  },
  async getById(id) {
    const { data, error } = await supabase.from('cms_contact').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(data) {
    const { data: result, error } = await supabase.from('cms_contact').insert([data]).select().single();
    if (error) throw error;
    return result;
  },
  async update(id, data) {
    const { data: result, error } = await supabase.from('cms_contact').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
  },
  async remove(id) {
    const { error } = await supabase.from('cms_contact').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};

export const cmsAppearanceService = {
  async getAll() {
    const { data, error } = await supabase.from('cms_appearance').select('*');
    if (error) throw error;
    return data;
  },
  async getById(id) {
    const { data, error } = await supabase.from('cms_appearance').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(data) {
    const { data: result, error } = await supabase.from('cms_appearance').insert([data]).select().single();
    if (error) throw error;
    return result;
  },
  async update(id, data) {
    const { data: result, error } = await supabase.from('cms_appearance').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
  },
  async remove(id) {
    const { error } = await supabase.from('cms_appearance').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}; 