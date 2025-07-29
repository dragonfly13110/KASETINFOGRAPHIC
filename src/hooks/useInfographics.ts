import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Infographic } from '../types';

export function useInfographics() {
  const [infographics, setInfographics] = useState<Infographic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInfographics = useCallback(async () => {
    // ทำให้ setLoading(true) ทุกครั้งที่เริ่ม fetch เพื่อให้ UI ตอบสนองถูกต้องเมื่อกด "ลองอีกครั้ง"
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from('infographics')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }
      setInfographics(data || []);
    } catch (err: any) {
      console.error('Error fetching infographics:', err);
      let fetchErrorMessage = 'เกิดข้อผิดพลาดในการดึงข้อมูล';
      if (err && err.message) {
        fetchErrorMessage = err.message;
      } else if (typeof err === 'string') {
        fetchErrorMessage = err;
      }
      setError(fetchErrorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInfographics();
  }, [fetchInfographics]);

  const addInfographic = async (newInfo: Omit<Infographic, 'id' | 'date' | 'created_at'>) => {
    try {
      const itemToAdd = {
        ...newInfo,
        date: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }),
      };

      const { data, error: supabaseError } = await supabase.from('infographics').insert([itemToAdd]).select().single();

      if (supabaseError) {
        throw supabaseError;
      }

      if (data) {
        setInfographics(prev => [data as Infographic, ...prev]);
      } else {
        fetchInfographics();
      }
    } catch (err: any) {
      console.error('>>> EXPAND THIS OBJECT TO SEE SUPABASE ERROR DETAILS:', err);
      let userMessage = 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล.';
      if (err && typeof err === 'object' && err.message) {
        userMessage += ` (ข้อความเบื้องต้น: ${err.message})`;
      }
      alert(`${userMessage}\n\n==== สำคัญมาก! ====\nกรุณาเปิด Console ของเบราว์เซอร์ (กด F12) และทำตามนี้:\n1. มองหาบรรทัดที่ขึ้นต้นด้วย '>>> EXPAND THIS OBJECT TO SEE SUPABASE ERROR DETAILS:'.\n2. **คลิกที่รูปลูกศร (▶) หรือสามเหลี่ยมเล็กๆ ด้านซ้ายของคำว่า 'Object' ที่แสดงในบรรทัดนั้น** เพื่อขยายดูรายละเอียดทั้งหมดของ Error.\n3. แจ้งรายละเอียดที่ขยายออกมานั้น (เช่น message, details, code, hint) ให้ผู้พัฒนาทราบ`);
    }
  };

  const updateInfographicInState = (updatedItem: Infographic) => {
    setInfographics((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  return { 
    infographics, 
    loading, 
    error, 
    fetchInfographics, 
    addInfographic, 
    updateInfographicInState 
  };
}