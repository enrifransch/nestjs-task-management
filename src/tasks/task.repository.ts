import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async createTask(createTaskDto: CreateTaskDto) {
        const { title, description } = createTaskDto;
        const task = new Task();
        task.status = TaskStatus.OPEN;
        task.title = title;
        task.description = description;
        return await task.save();
    }

    async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
        let tasks;
        const { status, search } = filterDto;

        if (!status && !search) {
            tasks = await this.find();
        }

        tasks = await this.createQueryBuilder('task')
            .where('task.status = :status OR task.title LIKE :search OR task.description LIKE :search', { status, search: `%${search}%` })
            .getMany();

        if (!tasks.length) {
            throw new NotFoundException(`Tasks not found.`);
        }

        return tasks;
    }
}
