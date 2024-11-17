import Constants from 'expo-constants';

export const supabaseUrl = 'https://asaebkvujjtfqfwrnixx.supabase.co';
export const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzYWVia3Z1amp0ZnFmd3JuaXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg2MDQxNzQsImV4cCI6MjA0NDE4MDE3NH0.Q5NFs8bT6ZHxQelFquiQ8oiP_Sq4RZdIxnP_JzoapsM';

export const appName =
  Constants.expoConfig?.name.charAt(0).toUpperCase() +
  Constants.expoConfig?.name.slice(1);
