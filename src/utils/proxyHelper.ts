import { supabase } from "@/integrations/supabase/client";

export const getProxiedData = async (table: string, options: {
  columns?: string;
  order?: string;
  limit?: number;
  filter?: string;
} = {}): Promise<any> => {
  let query = (supabase as any).from(table).select(options.columns || '*');
  
  if (options.filter) {
    const [column, operator, value] = options.filter.split(':');
    if (operator === 'eq') {
      query = query.eq(column, value);
    }
  }
  
  if (options.order) {
    const [column, direction] = options.order.split(':');
    query = query.order(column, { ascending: direction !== 'desc' });
  }
  
  if (options.limit) {
    query = query.limit(options.limit);
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data || [];
};

export const callProxiedRpc = async (functionName: string, params: any = {}): Promise<any> => {
  const { data, error } = await (supabase as any).rpc(functionName, params);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data || [];
};
