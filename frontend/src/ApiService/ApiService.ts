import { toast } from 'react-toastify';
import axiosInstance from "../AxiosConfig/AxiosConfig";

export const registerUser = async (values: any) => {
  try {
    
    const response = await axiosInstance.post('/register', values);
    return response

  } catch (error) {
    console.error('Registration failed:', error);
    toast.error('Registration failed. Please try again.');
  }
};

export const HandleLogout = async () => {
    try {
      
     await axiosInstance.get('/logout');

  
    } catch (error) {
      console.error('logout failed:', error);
    }
  };

  export const HandleLogin=async(values:any)=>{
    try{
    const response=await axiosInstance.post('/login',values)
    return response
} catch (error) {
    console.error('Login failed:', error);
    toast.error('Login failed. Please try again.');
}
  }

  export const EditProfile=async(values:any)=>{
    try{
        console.log(values,'hih');
        
        const response=await axiosInstance.put('/editprofile',values)
        return response
    } catch (error) {
        console.error('Profile edit failed:', error);
        toast.error('Profile edit  failed. Please try again.');
    }
  }

  export const ChangePassword=async(values:any,email:string)=>{
   try{
    const response=await axiosInstance.post('/changepassword',{values,email});
    return response
} catch (error:any) {
    console.error('Password change failed:', error);
    toast.error( error?.response?.data.message||'Password change  failed. Please try again.');
}
  }