import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Done'],
        default: 'To Do',
    },
    assignee: {
        type: String,
        required: false,
    },
    dueDate: {
        type: Date,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedBy: {
        type: String,
        required: false,
    },
    deletedAt: {
        type: Date,
        required: false,
    },
    createdBy: {
        type: String,
        required: false,
        default: "Anonymous",
    },
});

// Force Next.js to not use the old cached schema that doesn't have isDeleted
if (mongoose.models.Task) {
    delete mongoose.models.Task;
}

const Task = mongoose.model("Task", TaskSchema);

export default Task;