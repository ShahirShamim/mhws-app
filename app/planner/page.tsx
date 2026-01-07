"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus } from "lucide-react"

interface Task {
  id: string
  title: string
  steps: Step[]
}

interface Step {
  id: string
  title: string
  completed: boolean
}

export default function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)
  const [newStepTitle, setNewStepTitle] = useState<Record<string, string>>({})

  const addTask = () => {
    if (newTaskTitle.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          title: newTaskTitle,
          steps: [],
        },
      ])
      setNewTaskTitle("")
    }
  }

  const addStep = (taskId: string) => {
    const stepTitle = newStepTitle[taskId] || ""
    if (stepTitle.trim()) {
      setTasks(
        tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                steps: [
                  ...task.steps,
                  {
                    id: Date.now().toString(),
                    title: stepTitle,
                    completed: false,
                  },
                ],
              }
            : task,
        ),
      )
      setNewStepTitle({ ...newStepTitle, [taskId]: "" })
    }
  }

  const toggleStep = (taskId: string, stepId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              steps: task.steps.map((step) => (step.id === stepId ? { ...step, completed: !step.completed } : step)),
            }
          : task,
      ),
    )
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const deleteStep = (taskId: string, stepId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, steps: task.steps.filter((step) => step.id !== stepId) } : task,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-4 text-balance">Task Planner</h1>
          <p className="text-lg text-muted-foreground">
            Break down your goals into manageable steps and track your progress
          </p>
        </div>

        {/* Add New Task */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle>Create New Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="What's your goal?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTask()}
              className="bg-background border-border text-foreground"
            />
            <Button onClick={addTask} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="space-y-6">
          {tasks.map((task) => {
            const completedSteps = task.steps.filter((s) => s.completed).length
            const totalSteps = task.steps.length
            const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

            return (
              <Card key={task.id} className="bg-card border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{task.title}</CardTitle>
                      {totalSteps > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-primary font-semibold">
                              {completedSteps} of {totalSteps}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Steps List */}
                  <div className="space-y-2">
                    {task.steps.map((step) => (
                      <div key={step.id} className="flex items-center gap-3 p-2 rounded bg-background">
                        <input
                          type="checkbox"
                          checked={step.completed}
                          onChange={() => toggleStep(task.id, step.id)}
                          className="w-5 h-5 rounded border-border cursor-pointer accent-primary"
                        />
                        <span className={`flex-1 ${step.completed ? "line-through text-muted-foreground" : ""}`}>
                          {step.title}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteStep(task.id, step.id)}
                          className="text-destructive hover:text-destructive/90"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Add Step */}
                  <div className="pt-2 border-t border-border space-y-2">
                    <Input
                      placeholder="Add a step..."
                      value={newStepTitle[task.id] || ""}
                      onChange={(e) => setNewStepTitle({ ...newStepTitle, [task.id]: e.target.value })}
                      onKeyPress={(e) => e.key === "Enter" && addStep(task.id)}
                      className="bg-muted border-border text-foreground"
                    />
                    <Button onClick={() => addStep(task.id)} variant="secondary" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Step
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {tasks.length === 0 && (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No goals yet. Create your first one to get started!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
