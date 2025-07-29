// Helper functions to use proxied Supabase endpoints

const DOMAIN = window.location.origin;

export const getProxiedStorageUrl = (bucket: string, file: string): string => {
  return `${DOMAIN}/api/proxy-storage?bucket=${bucket}&file=${file}&action=download`;
};

export const getProxiedStorageSignedUrl = async (bucket: string, file: string): Promise<string> => {
  const response = await fetch(`${DOMAIN}/api/proxy-storage?bucket=${bucket}&file=${file}&action=url`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get storage URL');
  }
  
  return data.url;
};

export const getProxiedData = async (table: string, options: {
  columns?: string;
  order?: string;
  limit?: number;
} = {}): Promise<any> => {
  const params = new URLSearchParams({
    table,
    action: 'select',
    ...(options.columns && { columns: options.columns }),
    ...(options.order && { order: options.order }),
    ...(options.limit && { limit: options.limit.toString() })
  });

  const response = await fetch(`${DOMAIN}/api/proxy-data?${params}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch data');
  }
  
  return data.data;
};

export const callProxiedRpc = async (functionName: string, params: any = {}): Promise<any> => {
  const searchParams = new URLSearchParams({
    table: '', // Not used for RPC
    action: 'rpc',
    function: functionName,
    params: JSON.stringify(params)
  });

  const response = await fetch(`${DOMAIN}/api/proxy-data?${searchParams}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to call function');
  }
  
  return data.data;
};