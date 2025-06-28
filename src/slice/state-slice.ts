import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  states: [
    {
       value:"Andaman and Nicobar Islands",
       label:"35"
    },
    {
       value:"Andhra Pradesh",
       label:"28"
    },
    {
       value:"Andhra Pradesh (New)",
       label:"37"
    },
    {
       value:"Arunachal Pradesh",
       label:"12"
    },
    {
       value:"Assam",
       label:"18"
    },
    {
       value:"Bihar",
       label:"10"
    },
    {
       value:"Chandigarh",
       label:"04"
    },
    {
       value:"Chattisgarh",
       label:"22"
    },
    {
       value:"Dadra and Nagar Haveli",
       label:"26"
    },
    {
       value:"Daman and Diu",
       label:"25"
    },
    {
       value:"Delhi",
       label:"07"
    },
    {
       value:"Goa",
       label:"30"
    },
    {
       value:"Gujarat",
       label:"24"
    },
    {
       value:"Haryana",
       label:"06"
    },
    {
       value:"Himachal Pradesh",
       label:"02"
    },
    {
       value:"Jammu and Kashmir",
       label:"01"
    },
    {
       value:"Jharkhand",
       label:"20"
    },
    {
       value:"Karnataka",
       label:"29"
    },
    {
       value:"Kerala",
       label:"32"
    },
    {
       value:"Lakshadweep Islands",
       label:"31"
    },
    {
       value:"Madhya Pradesh",
       label:"23"
    },
    {
       value:"Maharashtra",
       label:"27"
    },
    {
       value:"Manipur",
       label:"14"
    },
    {
       value:"Meghalaya",
       label:"17"
    },
    {
       value:"Mizoram",
       label:"15"
    },
    {
       value:"Nagaland",
       label:"13"
    },
    {
       value:"Odisha",
       label:"21"
    },
    {
       value:"Pondicherry",
       label:"34"
    },
    {
       value:"Punjab",
       label:"03"
    },
    {
       value:"Rajasthan",
       label:"08"
    },
    {
       value:"Sikkim",
       label:"11"
    },
    {
       value:"Tamil Nadu",
       label:"33"
    },
    {
       value:"Telangana",
       label:"36"
    },
    {
       value:"Tripura",
       label:"16"
    },
    {
       value:"Uttar Pradesh",
       label:"09"
    },
    {
       value:"Uttarakhand",
       label:"05"
    },
    {
       value:"West Bengal",
       label:"19"
    }
 ],
};

export const StateSlice = createSlice({
  name: "StateCode",
  initialState,

  reducers: {
    addState: (state, action) => {
        state.states.push(action.payload);
    },  
    clearState:(state , {payload }) => {
        state.states = payload;
    }
  },
});

export const { addState , clearState } = StateSlice.actions;
export default StateSlice.reducer;