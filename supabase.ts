import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://gamrbeilmbikyudibhqr.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhbXJiZWlsbWJpa3l1ZGliaHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NzM1NDUsImV4cCI6MjEwMDA0OTU0NX0.t60tibpxY35uZBisNMezKUlfS0WAvik9HstNUFkmAiw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check if Supabase variables are set up
export const isSupabaseAvailable = !!SUPABASE_URL && !!SUPABASE_ANON_KEY;

// Authentication Helpers
export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const resetPasswordForEmail = async (email: string) => {
  const baseUrl = 'https://ais-dev-e5mmuze7h6kphvipyr2322-145367688422.asia-southeast1.run.app';
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/reset-password`,
  });
};

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function signOut() {
  await supabase.auth.signOut();
}

/**
 * Fetch the master CMS configuration from Supabase.
 * Uses a single-row "cms_settings" table or a key-value store.
 */
export async function fetchCMSDataFromSupabase() {
  if (!isSupabaseAvailable) return null;
  try {
    const { data, error } = await supabase
      .from('cms_sections')
      .select('data')
      .eq('id', 'main')
      .single();

    if (error) {
      // If table doesn't exist or row isn't found, handle gracefully
      console.warn('Supabase fetch CMS data warning:', error.message);
      return null;
    }
    return data?.data || null;
  } catch (err) {
    console.error('Failed to fetch CMS from Supabase:', err);
    return null;
  }
}

/**
 * Persist the master CMS configuration to Supabase.
 */
export async function saveCMSDataToSupabase(cmsData: any) {
  if (!isSupabaseAvailable) return false;
  try {
    const { error } = await supabase
      .from('cms_sections')
      .upsert({
        id: 'main',
        data: cmsData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.error('Supabase upsert CMS data error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save CMS to Supabase:', err);
    return false;
  }
}

/**
 * Fetch all enquiries from Supabase.
 */
export async function fetchEnquiriesFromSupabase() {
  if (!isSupabaseAvailable) return null;
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch enquiries warning:', error.message);
      return null;
    }
    
    // Map database fields to application model
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      subject: item.subject,
      message: item.message,
      date: item.date || item.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      status: item.status || 'New'
    }));
  } catch (err) {
    console.error('Failed to fetch enquiries from Supabase:', err);
    return null;
  }
}

/**
 * Save a new user enquiry to Supabase.
 */
export async function saveEnquiryToSupabase(enquiry: any) {
  if (!isSupabaseAvailable) return false;
  try {
    const { error } = await supabase
      .from('enquiries')
      .insert({
        id: enquiry.id,
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        subject: enquiry.subject,
        message: enquiry.message,
        date: enquiry.date,
        status: enquiry.status || 'New',
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Supabase insert enquiry error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save enquiry to Supabase:', err);
    return false;
  }
}

/**
 * Delete an enquiry from Supabase by ID.
 */
export async function deleteEnquiryFromSupabase(id: string) {
  if (!isSupabaseAvailable) return false;
  try {
    const { error } = await supabase
      .from('enquiries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete enquiry error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete enquiry from Supabase:', err);
    return false;
  }
}

/**
 * Update the status of an enquiry in Supabase.
 */
export async function updateEnquiryStatusInSupabase(id: string, status: 'New' | 'Replied' | 'Archived') {
  if (!isSupabaseAvailable) return false;
  try {
    const { error } = await supabase
      .from('enquiries')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Supabase update enquiry status error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to update enquiry status in Supabase:', err);
    return false;
  }
}

/**
 * Log a login attempt (successful or failed) to Supabase.
 */
export async function logLoginAttemptToSupabase(
  email: string,
  status: 'SUCCESS' | 'FAILED',
  ipAddress: string,
  userAgent: string
) {
  // Always log to local storage as a robust audit log backup
  try {
    const localAttempts = JSON.parse(localStorage.getItem('mindmap_local_login_attempts') || '[]');
    const newAttempt = {
      id: 'local_attempt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      email,
      status,
      ip_address: ipAddress || '127.0.0.1 (Local Fallback)',
      user_agent: userAgent || 'Unknown Browser',
      attempted_at: new Date().toISOString()
    };
    localAttempts.unshift(newAttempt);
    // Keep last 100 attempts
    if (localAttempts.length > 100) localAttempts.pop();
    localStorage.setItem('mindmap_local_login_attempts', JSON.stringify(localAttempts));
  } catch (e) {
    console.warn('Failed to save local login audit log:', e);
  }

  if (!isSupabaseAvailable) return true;
  try {
    const { error } = await supabase
      .from('login_attempts')
      .insert({
        email,
        status,
        ip_address: ipAddress || 'Unknown',
        user_agent: userAgent || 'Unknown',
        created_at: new Date().toISOString()
      });

    if (error) {
      if (error.message && (error.message.includes("Could not find the table") || error.message.includes("column"))) {
        console.info('Using Local Storage backup for login audit logs (Supabase table/column issue).');
      } else {
        console.error('Supabase log login attempt error:', error.message);
      }
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to log login attempt to Supabase:', err);
    return false;
  }
}

/**
 * Fetch all login attempts for the SQL audit log dashboard.
 */
export async function fetchLoginAttemptsFromSupabase() {
  const localAttempts = JSON.parse(localStorage.getItem('mindmap_local_login_attempts') || '[]');
  
  if (!isSupabaseAvailable) return localAttempts;
  try {
    const { data, error } = await supabase
      .from('login_attempts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.message && (error.message.includes("Could not find the table") || error.message.includes("column"))) {
        return localAttempts;
      }
      console.warn('Supabase fetch login attempts warning:', error.message);
      return localAttempts;
    }
    return (data && data.length > 0) ? data : localAttempts;
  } catch (err) {
    console.error('Failed to fetch login attempts from Supabase:', err);
    return localAttempts;
  }
}

/**
 * Delete a batch of login attempts by IDs from Supabase and LocalStorage backup.
 */
export async function deleteLoginAttemptsFromSupabase(ids: string[]) {
  // Always update LocalStorage backup
  try {
    const localAttempts = JSON.parse(localStorage.getItem('mindmap_local_login_attempts') || '[]');
    const updatedAttempts = localAttempts.filter((a: any) => !ids.includes(a.id));
    localStorage.setItem('mindmap_local_login_attempts', JSON.stringify(updatedAttempts));
  } catch (e) {
    console.warn('Failed to update local backup during deletion:', e);
  }

  if (!isSupabaseAvailable) return true;
  try {
    const { error } = await supabase
      .from('login_attempts')
      .delete()
      .in('id', ids);

    if (error) {
      if (error.message && (error.message.includes("Could not find the table") || error.message.includes("invalid input syntax"))) {
        console.info('Ignoring deletion error (Supabase table/ID issue).');
        return true;
      }
      console.error('Supabase delete login attempts error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete login attempts from Supabase:', err);
    return false;
  }
}

/**
 * Clean up/delete login attempts older than 24 hours.
 */
export async function cleanLoginAttemptsOlderThan24Hours() {
  const cutoffTime = Date.now() - 24 * 60 * 60 * 1000;
  const cutoffIso = new Date(cutoffTime).toISOString();

  // Always update LocalStorage backup
  try {
    const localAttempts = JSON.parse(localStorage.getItem('mindmap_local_login_attempts') || '[]');
    const updatedAttempts = localAttempts.filter((a: any) => {
      if (!a.attempted_at) return true;
      return new Date(a.attempted_at).getTime() >= cutoffTime;
    });
    localStorage.setItem('mindmap_local_login_attempts', JSON.stringify(updatedAttempts));
  } catch (e) {
    console.warn('Failed to clean local backup during older-than-24h cleanup:', e);
  }

  if (!isSupabaseAvailable) return true;
  try {
    const { error } = await supabase
      .from('login_attempts')
      .delete()
      .lt('created_at', cutoffIso);

    if (error) {
      if (error.message && error.message.includes("Could not find the table")) {
        console.info('Using Local Storage backup for login audit logs (Supabase table login_attempts not present).');
        return true;
      }
      console.error('Supabase cleanup of 24h old attempts error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to clean older login attempts from Supabase:', err);
    return false;
  }
}

