import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dldiedktrkbwpqznxdwk.supabase.co'; // เปลี่ยนเป็น URL ของคุณ
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsZGllZGt0cmtid3Bxem54ZHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTM4ODMsImV4cCI6MjA2NDE2OTg4M30.teFTNA7Zez_qUO9-wQALPdw_ULLmmfNhOlNHD_CdtHc'; // เปลี่ยนเป็น API Key ของคุณ
const supabase = createClient(supabaseUrl, supabaseKey);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
