import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { handleErrorState } from "../utils/handleErrorState";
import { handleApiError } from "../utils/handleApiError";
import { getAuthData } from "../utils/authUtils";

const baseUrl = process.env.REACT_APP_API_URL;
// const baseUrl = "htt;ps://planmate-backend.onrender.com/api";

const getTasks = createAsyncThunk(
    "tasks/getTasks",
    async (_ ,{ rejectWithValue }) => {
        try {
            const { userId, token } = getAuthData();
            const res = await axios.get(`${baseUrl}/tasks/all-tasks?userId=${userId}` , {
                    headers : {
                     Authorization : `Bearer ${token}`
                  }
            });
            return res.data;
        } catch (error) {
            console.log(error);
            return handleApiError(error, rejectWithValue);
        }
    }
);

const getTodayTasksByUser = createAsyncThunk(
    "tasks/getTodayTasksByUser",
    async (_ ,{ rejectWithValue }) => {
        try {
            const { userId, token } = getAuthData();
            const res = await axios.get(`${baseUrl}/tasks/tasks-today/${userId}` , {
                    headers : {
                     Authorization : `Bearer ${token}`
                  }
            });
            return res.data;
        } catch (error) {
            console.log(error.response.data);
            return handleApiError(error, rejectWithValue);
        }
    }
);

const addTask = createAsyncThunk(
    "tasks/addTask",
    async (task, { rejectWithValue }) => {
        try {
            const { userId, token } = getAuthData();
            const res = await axios.post(`${baseUrl}/tasks/add-task?userId=${userId}`, task , {
                    headers : {
                     Authorization : `Bearer ${token}`
                  }
            });
            console.log("Task added:", res.data);
            return res.data;

        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

const deleteTask = createAsyncThunk(
    "tasks/deleteTask",
    async (taskId, { rejectWithValue }) => {
        try {
            const { userId, token } = getAuthData();
            const res = await axios.delete(`${baseUrl}/tasks/delete-task/${taskId}` , {
                    headers : {
                     Authorization : `Bearer ${token}`
                  }
            });
            console.log("succeded")
            return taskId;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

const updateTask = createAsyncThunk(
    "tasks/updateTask",
    async ({ taskId, updatedTask }, { rejectWithValue }) => {
        try {
            const { userId, token } = getAuthData();
            const res = await axios.put(`${baseUrl}/tasks/update-task/${taskId}`, updatedTask , {
                    headers : {
                     Authorization : `Bearer ${token}`
                  }
            });
            return res.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

const taskSlice = createSlice({
    name: "tasks",
    initialState: {
        tasks: [],
        todayTasks : [],
        loading: false,
        backendTaskError : null,
        serverError : {}
    },

    extraReducers: (builder) => {
        builder
            .addCase(getTasks.pending, (state) => {
                state.loading = true;
                state.backendTaskError = null;
                state.serverError = {}
            })
            .addCase(getTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload || [];
            })
            .addCase(getTasks.rejected, handleErrorState)

            .addCase(getTodayTasksByUser.pending, (state) => {
                state.loading = true;
                state.backendTaskError = null;
                state.serverError = {};
                state.todayTasks = []
            })
            .addCase(getTodayTasksByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.todayTasks = action.payload || [];
            })
            .addCase(getTodayTasksByUser.rejected, handleErrorState)

            .addCase(addTask.pending, (state) => {
                state.loading = true;
                state.backendTaskError = null;
                state.serverError = {};
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.tasks = [...state.tasks, action.payload]; 
                }
            })
            .addCase(addTask.rejected, handleErrorState)

            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.backendTaskError = null;
                state.serverError = {};
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = state.tasks.filter((task) => task._id !== action.payload);
                state.todayTasks = state.todayTasks.filter((task) => task._id !== action.payload);
            })
            .addCase(deleteTask.rejected, handleErrorState)

            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.backendTaskError = null;
                state.serverError = {};
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.tasks.findIndex((task) => task._id === action.payload._id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            .addCase(updateTask.rejected, handleErrorState)
    }
});

export default taskSlice.reducer;
export { getTasks, getTodayTasksByUser , addTask, deleteTask, updateTask };
