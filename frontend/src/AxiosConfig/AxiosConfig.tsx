import axios, { AxiosError } from 'axios';

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/" ,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

interface AuthInfo {
  accessToken: string | null;
  role: string | null;
}

let authInfo: AuthInfo = {
  accessToken: null,
  role: null
};

export const setAuthInfo = (token: string, role: string) => {
  authInfo = { accessToken: token, role: role };
  localStorage.setItem('authInfo', JSON.stringify(authInfo));
};

export const clearAuthInfo = () => {
  authInfo = { accessToken: null, role: null };
  localStorage.removeItem('authInfo');
};


const storedAuthInfo = localStorage.getItem('authInfo');
if (storedAuthInfo) {
  authInfo = JSON.parse(storedAuthInfo);
}

axiosInstance.interceptors.request.use(
  (config) => {
    console.log(authInfo.accessToken, '.....accessToken');
    if (authInfo.accessToken) {
      config.headers['Authorization'] = `Bearer ${authInfo.accessToken}`;
      config.headers['Role'] = authInfo.role;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const { data } = await axiosInstance.post('/api/auth/refresh-token', 
          { token: refreshToken },
          { baseURL: "http://localhost:8080/", withCredentials: true }
        );
        
        setAuthInfo(data.accessToken, data.role);
        
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
     
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        clearAuthInfo();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    //@ts-ignore 
    else if ( error.response?.data?.isBlocked === true) {
      console.log(error,'rerrraxio');
      
      clearAuthInfo();
      window.location.href = '/401';
      setTimeout(()=>{
        window.location.href = '/login';
      },5000)
      return Promise.reject(error);
    } 
    return Promise.reject(error);
  }
);

export default axiosInstance;