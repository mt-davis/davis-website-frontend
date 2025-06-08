interface QueryParams {
  filters?: Record<string, any>;
  populate?: string | string[] | Record<string, any>;
  sort?: string[];
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}

export async function fetchAPI(endpoint: string, queryParams: QueryParams = {}) {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_STRAPI_API_URL is not configured');
  }

  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  // Build the query string
  const queryParts: string[] = [];

  // Handle filters
  if (queryParams.filters) {
    Object.entries(queryParams.filters).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([operator, operatorValue]) => {
          queryParts.push(`filters[${key}][${operator}]=${encodeURIComponent(operatorValue as string)}`);
        });
      } else {
        queryParts.push(`filters[${key}]=${encodeURIComponent(value as string)}`);
      }
    });
  }

  // Handle populate
  if (queryParams.populate) {
    if (typeof queryParams.populate === 'string') {
      queryParts.push(`populate=${encodeURIComponent(queryParams.populate)}`);
    } else if (Array.isArray(queryParams.populate)) {
      queryParams.populate.forEach(field => {
        queryParts.push(`populate=${encodeURIComponent(field)}`);
      });
    } else {
      queryParts.push(`populate=${encodeURIComponent(JSON.stringify(queryParams.populate))}`);
    }
  }

  // Handle sorting
  if (queryParams.sort) {
    queryParams.sort.forEach(sortField => {
      queryParts.push(`sort=${encodeURIComponent(sortField)}`);
    });
  }

  // Handle pagination
  if (queryParams.pagination) {
    Object.entries(queryParams.pagination).forEach(([key, value]) => {
      queryParts.push(`pagination[${key}]=${value}`);
    });
  }

  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  const url = `${apiUrl}/api/${cleanEndpoint}${queryString}`;

  try {
    const res = await fetch(url, { 
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error('API Error Response:', errorData);
      throw new Error(`API error: ${errorData}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching from Strapi:', error);
    throw error;
  }
} 