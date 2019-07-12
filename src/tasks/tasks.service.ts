import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository) {

    }

    // private tasks: Task[] = [];

    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }

    async getAllTasks() {
        const tasks = await this.taskRepository.find();

        if (!tasks) {
            throw new NotFoundException(`No tasks found.`);
        }

        return tasks;
    }

    // getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
    //     const { status, search } = filterDto;
    //     let tasks = this.getAllTasks();

    //     if (status) {
    //         tasks = tasks.filter(task => task.status === status);
    //     }

    //     if (search) {
    //         tasks = tasks.filter(
    //             task => task.title.includes(search) || task.description.includes(search),
    //             );
    //     }
    //     return tasks;
    // }

    async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;

        if (!status && !search) {
            return await this.getAllTasks();
        }

        const found = await this.taskRepository
            .createQueryBuilder('task')
            .where('task.status = :status OR task.title LIKE :search OR task.description LIKE :search', { status, search: `%${search}%` })
            .getMany();

        if (!found.length) {
            throw new NotFoundException(`Tasks not found.`);
        }

        return found;
    }

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Task with id:${id} not found.`);
        }

        return found;
    }

    // getTaskById(id: string): Task {
    //     const found = this.tasks.find(task => task.id === id);

    //     if (!found) {
    //         throw new NotFoundException(`Task with id:${id} not found.`);
    //     }

    //     return found;
    // }

    async deleteTaskById(id: number): Promise<any> {
        const result = await this.taskRepository.delete(id)

        if (result.affected === 0) {
            throw new NotFoundException(`Task with id:${id} not found.`);
        }

        return result;
    }

    // deleteTaskById(id: string): void {
    //     const found = this.getTaskById(id);
    //     this.tasks = this.tasks.filter(task => task.id !== id);
    // }

    async createTask(createTaskDto: CreateTaskDto) {
        return this.taskRepository.createTask(createTaskDto);
    }

    // createTask(createTaskDto: CreateTaskDto): Task {
    //     const { title, description } = createTaskDto;
    //     const task: Task = {
    //         title,
    //         description,
    //         status: TaskStatus.OPEN,
    //         id: uuid(),
    //     };

    //     this.tasks.push(task);
    //     return task;
    // }

    async updateTask(id, param, body): Promise<Task> {
        const task = await this.getTaskById(id);
        task[param] = body[param];
        return await this.taskRepository.save(task);
    }

    // updateTask(id, param, body): Task {
    //     const index = this.tasks.findIndex(task => task.id);
    //     this.tasks[index][param] = body[param];
    //     return this.tasks[index];
    // }

}
