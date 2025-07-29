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
      setError(err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInfographics();
  }, [fetchInfographics]);

  const addInfographic = async (newInfo: Omit<Infographic, 'id' | 'date' | 'created_at'>) => {
    // The component calling this function should wrap it in a try/catch block.
    const itemToAdd = {
      ...newInfo,
      // Best Practice Tip: It's often better to let the database handle timestamps
      // with a default value like `now()` or `CURRENT_TIMESTAMP`.
      // This ensures data consistency regardless of the client's clock.
      date: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }),
    };

    const { data, error: supabaseError } = await supabase.from('infographics').insert([itemToAdd]).select().single();

    if (supabaseError) {
      // Re-throw the error to be caught by the calling component's catch block.
      throw supabaseError;
    }

    if (data) {
      // Add the new item to the top of the list for immediate feedback
      setInfographics(prev => [data as Infographic, ...prev]);
    } else {
      // Fallback if the insert operation doesn't return the new data
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