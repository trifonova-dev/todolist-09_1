import type {Task, TasksState} from '../app/App.tsx'
import {createAction, createReducer, nanoid} from "@reduxjs/toolkit";
import {createTodolistAC, deleteTodolistAC} from "./todolists-reducer.ts";

const initialState: TasksState = {}

export const deleteTaskAC = createAction<{ todolistId: string, taskId: string }>("tasks/deleteTaskAC")

export const createTaskAC = createAction<{ todolistId: string, title: string }>("tasks/createTaskAC")

export const changeTaskStatusAC = createAction<{
    todolistId: string,
    taskId: string,
    isDone: boolean
}>("tasks/changeTaskStatusAC")

export const changeTaskTitleAC = createAction<{
    todolistId: string,
    taskId: string,
    title: string
}>("tasks/changeTaskTitleAC")


export const tasksReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(deleteTodolistAC, (state, action) => {
            delete state[action.payload.id]
        })
        .addCase(createTodolistAC, (state, action) => {
            state[action.payload.id] = []
        })
        .addCase(deleteTaskAC, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(task => task.id === action.payload.taskId)
            if (index !== -1) {
                tasks.splice(index, 1)
            }
        })
        .addCase(createTaskAC, (state, action) => {
            const newTask: Task = {id: nanoid(), title: action.payload.title, isDone: false}
            state[action.payload.todolistId].unshift(newTask)
        })
        .addCase(changeTaskStatusAC, (state, action) => {
            const task = state[action.payload.todolistId].find(task => task.id === action.payload.taskId)
            if (task) {
                task.isDone = action.payload.isDone
            }
        })
        .addCase(changeTaskTitleAC, (state, action) => {
            const task = state[action.payload.todolistId].find(task => task.id === action.payload.taskId)
            if (task) {
                task.title = action.payload.title
            }
        })
})

export const tasksReducer2 = (state: TasksState = initialState, action: any): TasksState => {
    switch (action.type) {
        case 'delete_task': {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter(task => task.id !== action.payload.taskId)
            }
        }
        case 'create_task': {
            const newTask: Task = {title: action.payload.title, isDone: false, id: nanoid()}
            return {...state, [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]]}
        }
        case "change_task_status": {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(task => task.id === action.payload.taskId ? {
                    ...task,
                    isDone: action.payload.isDone
                } : task)
            }
        }
        case "change_task_title": {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(task => task.id === action.payload.taskId ? {
                    ...task,
                    title: action.payload.title
                } : task)
            }
        }
        case "create_todolist": {
            return {...state, [action.payload.id]: []}
        }
        case "delete_todolist": {
            const newState = {...state}
            delete newState[action.payload.id]
            return newState
        }
        default:
            return state
    }
}
