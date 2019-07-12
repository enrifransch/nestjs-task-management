import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';

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
}
