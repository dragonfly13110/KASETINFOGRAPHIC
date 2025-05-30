import { config } from 'dotenv';
config(); // โหลด environment variables
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dldiedktrkbwpqznxdwk.supabase.co'; // ใส่ Project URL ของคุณ
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsZGllZGt0cmtid3Bxem54ZHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTM4ODMsImV4cCI6MjA2NDE2OTg4M30.teFTNA7Zez_qUO9-wQALPdw_ULLmmfNhOlNHD_CdtHc'; // ใส่ Anon Key ของคุณ
export const supabase = createClient(supabaseUrl, supabaseAnonKey);