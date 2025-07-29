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
      // Use the error message from Supabase directly for more specific feedback.
      setError(err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInfographics();
  }, [fetchInfographics]);

  const addInfographic = async (newInfo: Omit<Infographic, 'id' | 'date' | 'created_at'>) => {
    // This function will now throw an error on failure,
    // which should be handled by a try/catch block in the component that calls it (e.g., AdminPage).
    const itemToAdd = {
      ...newInfo,
      date: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }),
    };

    const { data, error: supabaseError } = await supabase.from('infographics').insert([itemToAdd]).select().single();

    if (supabaseError) {
      // Throw the detailed error from Supabase to be caught by the UI component.
      throw supabaseError;
    }

    if (data) {
      setInfographics(prev => [data as Infographic, ...prev]);
    } else {
      // Fallback in case insert doesn't return data
      fetchInfographics();
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