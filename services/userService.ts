import { supabase } from '@/lib/supabase';

export const getUserData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('id', userId)
      .single();

    if (error) {
      console.log(`getUserData error: ${JSON.stringify(error, null, 2)}`);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
    // Pretty sure there isn't a true way to handle it
  } catch (error: any) {
    console.log(`getUserData error: ${JSON.stringify(error, null, 2)}`);
    return { success: false, msg: error.message };
  }
};

export const updateUser = async (userId: string, data: any) => {
  try {
    const { error } = await supabase
      .from('users')
      .update(data)
      .eq('id', userId);
    if (error) {
      console.log(`updateUser error: ${JSON.stringify(error, null, 2)}`);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
    // Pretty sure there isn't a true way to handle it
  } catch (error: any) {
    console.log(`updateUser error: ${JSON.stringify(error, null, 2)}`);
    return { success: false, msg: error.message };
  }
};

/** Deletes the currently logged in user */
export const removeUser = async (userId?: string) => {
  try {
    // TODO ? Deletes user from auth, but not users table
    const { data, error } = await supabase.rpc('delete_user');

    if (error) {
      console.log(`removeUser error: `, error);
      return { success: false, msg: 'Could not delete the user' };
    }

    return { success: true, data };
  } catch (error) {
    console.log(`removeUser error: `, error);
    return { success: false, msg: 'Could not delete the user' };
  }
};
