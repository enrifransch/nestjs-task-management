import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '../../dist/tasks/task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Get()
    getTasks(@Query() filterDto: GetTaskFilterDto): Task[] {
        if (Object.keys(filterDto).length) {
            return this.tasksService.getTasksWithFilters(filterDto);
        }
        return this.tasksService.getAllTasks();
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.tasksService.createTask(createTaskDto);
    }

    @Patch('/:id/:param')
    updateTask(@Param('id') id: string, @Param('param') param: string, @Body() body): Task {
        return this.tasksService.updateTask(id, param, body);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string): void {
        return this.tasksService.deleteTaskById(id);
    }
}
