import { supabase } from '../lib/supabase';

export const api = {
  // Tasks
  tasks: {
    list: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('deadline', { ascending: true });
      if (error) throw error;
      return data;
    },
    get: async (id) => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, reminders(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    create: async (taskData) => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ ...taskData, user_id: user.id }])
    .select()
    .single();
  if (error) throw error;
  return data;
},
    update: async (id, taskData) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    },
  },

  // Reminders
  reminders: {
    list: async () => {
      const { data, error } = await supabase.from('reminders').select('*');
      if (error) throw error;
      return data;
    },
    getHistory: async (taskId) => {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('task_id', taskId);
      if (error) throw error;
      return data;
    },
  },

  // Auth (Boilerplate - will need integration with UI)
  auth: {
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
    signOut: () => supabase.auth.signOut(),
    getUser: () => supabase.auth.getUser(),
  },
};