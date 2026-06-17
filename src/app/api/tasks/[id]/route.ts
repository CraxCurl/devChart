import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const body = await request.json();
        
        // Next.js 15+ dynamic APIs require awaiting params
        const { id } = await params;
        
        const task = await Task.findByIdAndUpdate(id, body, { new: true });
        
        if (!task) {
            return Response.json({ message: "Task not found" }, { status: 404 });
        }
        
        return Response.json(task, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ message: "Failed to update task" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        
        const { id } = await params;
        const url = new URL(request.url);
        const user = url.searchParams.get("user") || "Anonymous";
        const hardDelete = url.searchParams.get("hard") === "true";
        
        let task;
        if (hardDelete) {
            task = await Task.findByIdAndDelete(id);
        } else {
            task = await Task.findByIdAndUpdate(id, {
                isDeleted: true,
                deletedBy: user,
                deletedAt: new Date()
            }, { new: true });
        }
        
        if (!task) {
            return Response.json({ message: "Task not found" }, { status: 404 });
        }
        
        return Response.json({ message: hardDelete ? "Task deleted permanently" : "Task moved to trash" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ message: "Failed to delete task" }, { status: 500 });
    }
}
