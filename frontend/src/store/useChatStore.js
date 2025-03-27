import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';
import { User } from 'lucide-react';


export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get('/messages/users');
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    // Guard against an invalid userId
    if (!userId) {
      toast.error("User id is missing");
      return;
    }
    
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  
  subscribeToMessages: () => {
    
    

    const socket = useAuthStore.getState().socket;

    socket.on('newMessage', (newMessage) => {
      const { selectedUser, messages, users } = get();
      set({ messages: [...messages, newMessage] });
      const isMessageSentFromSelectedUser = selectedUser?._id === newMessage.senderId;
      const senderName = newMessage.senderName || users.find((user) => user._id === newMessage.senderId)?.fullName || "Unknown Sender";
      
      if (!isMessageSentFromSelectedUser || !selectedUser) {
        toast.success(`New message received ${senderName}`);
      }

    });
  },

  unsubcribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off('newMessage');
  },

  setSelectedUser: (selectedUser) => set({ selectedUser })
}));
