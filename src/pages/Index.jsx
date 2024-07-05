import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Index = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [priority, setPriority] = useState("Low");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const handleAddTask = () => {
    if (!taskName || !taskDescription || !dueDate) {
      toast.error("Please fill in all fields");
      return;
    }

    const newTask = {
      id: Date.now(),
      name: taskName,
      description: taskDescription,
      dueDate,
      priority,
    };

    setTasks([...tasks, newTask]);
    resetForm();
    toast.success("Task added successfully");
  };

  const handleEditTask = (task) => {
    setIsEditing(true);
    setCurrentTask(task);
    setTaskName(task.name);
    setTaskDescription(task.description);
    setDueDate(task.dueDate);
    setPriority(task.priority);
  };

  const handleSaveTask = () => {
    if (!taskName || !taskDescription || !dueDate) {
      toast.error("Please fill in all fields");
      return;
    }

    const updatedTasks = tasks.map((task) =>
      task.id === currentTask.id
        ? { ...task, name: taskName, description: taskDescription, dueDate, priority }
        : task
    );

    setTasks(updatedTasks);
    resetForm();
    setIsEditing(false);
    setCurrentTask(null);
    toast.success("Task updated successfully");
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    toast.success("Task deleted successfully");
  };

  const resetForm = () => {
    setTaskName("");
    setTaskDescription("");
    setDueDate(null);
    setPriority("Low");
  };

  return (
    <div className="container mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">TodoMaster</h1>
        <p className="text-lg text-muted-foreground">Your personal task manager</p>
      </header>

      <main>
        <div className="mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="primary">Add Task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Task" : "Add Task"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Task Name"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
                <Textarea
                  placeholder="Task Description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  className="rounded-md border"
                />
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={isEditing ? handleSaveTask : handleAddTask}>
                  {isEditing ? "Save Task" : "Add Task"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <CardTitle>{task.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{task.description}</p>
                <p>Due Date: {format(task.dueDate, "PPP")}</p>
                <p>Priority: {task.priority}</p>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" onClick={() => handleEditTask(task)}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDeleteTask(task.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;