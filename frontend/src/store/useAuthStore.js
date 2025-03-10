import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast"
import { LogOut } from "lucide-react";

export const useAuthStore= create((set)=>({
    authUser:null,
    isSigninUp:false,
    isLoggingIng:false,
    isUpdatingProfile:false,

    isCheckingAuth:true,

    checkAuth:async()=>{
        try{
            const res=await axiosInstance.get('/auth/check');
            set({authUser:res.data})

        }
        catch(error){
            console.log("Error in checkAuth:",error)
            set({authUser:null})
        } finally{
            set({isCheckingAuth:false})
        }
    },
    signup:async(data)=>{
        set({isSigninUp:true})
        try {
            const res=await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Account created sucessfully")
            
        } catch (error) {
            toast.error(error.response.data.message);
            
        } finally{
            set({isSigninUp:false})
        }

    },
    login:async(data)=>{
        set({isLoggingIng:true});
        try {
            const res=await axiosInstance.post("/auth/login",data)
            set({authUser:res.data});
            toast.success("Logged in Successfully")
        } catch (error) {
            toast.error(error.response.data.message)
            
        }finally{
            set({isLoggingIng:false})
        }

    },
    logout: async ()=>{
        try {
            await axiosInstance.post("/auth/logout")
            set({authUser:null})
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error(error.response.data.message)
            
        }
    }


}))