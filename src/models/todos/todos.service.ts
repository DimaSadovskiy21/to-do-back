import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { UsersService } from 'models/users/users.service';

import { Todo, TodoDocument } from './schema';
import { CreateTodoDto, DeleteTodoDto, TodosDto, UpdateTodoDto } from './dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    private readonly usersService: UsersService,
  ) {}

  async getTodos(todosDto: TodosDto) {
    const { userId, page, limit, myTodos } = todosDto;

    const subscriptions = await this.usersService.getUserSubscriptions(userId);

    const skip = (page - 1) * limit;

    const [{ todos, totalCount }] = await this.todoModel.aggregate([
      ...(myTodos
        ? [
            {
              $match: { author: new Types.ObjectId(userId) },
            },
          ]
        : [
            {
              $match: { author: { $in: subscriptions } },
            },
          ]),
      {
        $facet: {
          todos: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author',
                pipeline: [{ $project: { username: 1 } }],
              },
            },
            { $unwind: '$author' },
          ],
          totalCount: [{ $count: 'totalItems' }],
        },
      },
    ]);

    let pagesCount = 0;

    if (totalCount.length) {
      const [{ totalItems = 0 }] = totalCount;

      pagesCount = Math.ceil(totalItems / limit);
    }

    return {
      todos,
      page,
      limit,
      pagesCount,
      hasNextPage: page < pagesCount,
    };
  }

  async createTodo(createTodoDto: CreateTodoDto) {
    const { content, author } = createTodoDto;

    return await this.todoModel.create({ content, author });
  }

  async deleteTodo(deleteTodoDto: DeleteTodoDto) {
    const { userId, todoId } = deleteTodoDto;

    await this.todoModel.findOneAndRemove({
      _id: todoId,
      author: userId,
    });

    return true;
  }

  async updateTodo(updateTodoDto: UpdateTodoDto) {
    const { userId, todoId, content } = updateTodoDto;

    return await this.todoModel.findOneAndUpdate(
      { _id: todoId, author: userId },
      {
        $set: {
          content,
        },
      },
      {
        new: true,
      },
    );
  }
}
