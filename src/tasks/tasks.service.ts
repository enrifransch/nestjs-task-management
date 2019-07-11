import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid/v1'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
        const { status, search } = filterDto;

        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }

        if (search) {
            tasks = tasks.filter(
                task => task.title.includes(search) || task.description.includes(search),
                );
        }
        return tasks;
    }

    getTaskById(id: string): Task {
        return this.tasks.find(task => task.id === id);
    }

    deleteTaskById(id: string): void {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;
        const task: Task = {
            title,
            description,
            status: TaskStatus.OPEN,
            id: uuid(),
        };

        this.tasks.push(task);
        return task;
    }

    updateTask(id, param, body): Task {
        const index = this.tasks.findIndex(task => task.id);
        this.tasks[index][param] = body[param];
        return this.tasks[index]
    }
}
