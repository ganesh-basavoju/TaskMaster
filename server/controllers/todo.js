import { connectToDB } from '../utils/connect.js';
import Todo from '../models/todoModel.js';
import { createError } from '../utils/error.js';

// Get all todos
export async function getAllTodos(req, res, next) {
    try {
        await connectToDB();
        if (!req.user || !req.user.id) {
            return next(createError(401, "Unauthorized: User ID is missing!"));
        }
        const todos = await Todo.find({ userID: req.user.id });
        res.status(200).json(todos);
    } catch (error) {
        next(createError(500, "Failed to fetch todos!"));
    }
}

// Get a single todo
export async function getTodo(req, res, next) {
    try {
        await connectToDB();
        const todo = await Todo.findById(req.params.id);
        if (!todo) return next(createError(404, "Todo not found!"));

        if (todo.userID.toString() !== req.user.id) {
            return next(createError(403, "Not authorized to access this todo!"));
        }

        res.status(200).json(todo);
    } catch (error) {
        next(createError(500, "Failed to fetch the todo!"));
    }
}

// Create a new todo
export async function addTodo(req, res, next) {
    try {
        await new Promise((resolve)=> setTimeout(resolve,2000));
        if (!req.body || !req.body.title) {
            return next(createError(400, "Title is required!"));
        }

        if (!req.user || !req.user.id) {
            return next(createError(401, "Unauthorized: User ID is missing!"));
        }

        await connectToDB();

        const newTodo = new Todo({
            title: req.body.title,
            userID: req.user.id,
        });

        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.error("Error while creating a new todo:", error); // Debugging line
        next(createError(500, "Failed to create a new todo!"));
    }
}

// Update a todo
export async function updateTodo(req, res, next) {
    try {
        if (!req.body) return next(createError(400, "Missing fields!"));

        await connectToDB();
        const todo = await Todo.findById(req.params.id);
        if (!todo) return next(createError(404, "Todo not found!"));

        if (todo.userID.toString() !== req.user.id) {
            return next(createError(403, "Not authorized to update this todo!"));
        }

        // Update fields
        todo.title = req.body.title || todo.title;
        if (req.body.isCompleted !== undefined) {
            todo.isCompleted = req.body.isCompleted;
        }

        await todo.save();
        res.status(200).json({ message: "Todo updated", todo });
    } catch (error) {
        next(createError(500, "Failed to update the todo!"));
    }
}

// Delete a todo
export async function deleteTodo(req, res, next) {
    try {
        await connectToDB();
        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            userID: req.user.id,
        });

        if (!todo) return next(createError(404, "Todo not found or not authorized!"));

        res.status(200).json({ message: "Todo deleted!" });
    } catch (error) {
        next(createError(500, "Failed to delete the todo!"));
    }
}
