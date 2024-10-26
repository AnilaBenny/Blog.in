import { createSlice } from "@reduxjs/toolkit";



interface UserState {
  user: any | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: any) => {
      console.log(action.payload,'action.payload');
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("isAuthenticated", "true");
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false; 
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
    },
    
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectIsUserAuthenticated = (state: { user: UserState }) => state.user.isAuthenticated;

export default userSlice.reducer;
export type { UserState };
