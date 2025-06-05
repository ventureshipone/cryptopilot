/**
 * Utility function for making API requests
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export async function apiRequest(method: HttpMethod, endpoint: string, data?: any) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for auth
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  // Ensure endpoint always starts with /
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  try {
    console.log(`Making ${method} request to ${url}`, data ? { requestData: data } : '');
    const response = await fetch(url, options);

    // Log response status for debugging
    console.log(`Response from ${url}: status=${response.status}, ok=${response.ok}`);
    
    // For debugging, try to get the response text
    let responseText;
    try {
      // Clone the response to avoid consuming it
      const responseClone = response.clone();
      responseText = await responseClone.text();
      if (responseText) {
        console.log(`Response body from ${url}:`, responseText.length > 500 ? 
          responseText.substring(0, 500) + "..." : responseText);
      }
    } catch (readError) {
      console.error(`Error reading response text from ${url}:`, readError);
    }

    // Check if the response is ok
    if (!response.ok) {
      // Try to parse as JSON for error details, or use text if that fails
      let errorMessage = `API request failed with status ${response.status}`;
      
      try {
        // If we already got the text above, try to parse it
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData?.error || errorData?.message || errorMessage;
          } catch (jsonError) {
            errorMessage = responseText || errorMessage;
          }
        } else {
          // Otherwise try to get JSON directly
          const errorData = await response.json().catch(() => null);
          errorMessage = errorData?.error || errorData?.message || errorMessage;
        }
      } catch (parseError) {
        console.error(`Error parsing error response from ${url}:`, parseError);
      }
      
      console.error(`API request failed: ${url}`, errorMessage);
      throw new Error(errorMessage);
    }

    console.log(`Successfully completed ${method} request to ${url}`);
    return response;
  } catch (error) {
    console.error(`Error in apiRequest to ${url}:`, error);
    throw error;
  }
}