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

    async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
        return await this.taskRepository.getTasks(filterDto);
    }

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Task with id:${id} not found.`);
        }

        return found;
    }

    async deleteTaskById(id: number): Promise<any> {
        const result = await this.taskRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Task with id:${id} not found.`);
        }

        return result;
    }

    async createTask(createTaskDto: CreateTaskDto) {
        return this.taskRepository.createTask(createTaskDto);
    }

    async updateTask(id, param, body): Promise<Task> {
        const task = await this.getTaskById(id);
        task[param] = body[param];
        return await this.taskRepository.save(task);
    }

}
