import { DeleteUserDto } from './dto/deleteUser.dto';
import { UsersDto } from './dto/users.dto';
import { ToggleSubscribeDto } from './dto/toggleSubscribe.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { TokenService } from 'models/token/token.service';

import { User, UserDocument } from './schema';
import { CreateUserDto, UserDto, HasUserDto } from './dto';
import { Todo, TodoDocument } from 'models/todos/schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    private readonly tokenService: TokenService,
  ) {}

  async findUserById(userId: Types.ObjectId) {
    return await this.userModel.findById(userId);
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async getUserSubscriptions(userId: Types.ObjectId) {
    const user = await this.findUserById(userId);

    return user.subscriptions;
  }

  async getUserSubscribers(userId: Types.ObjectId) {
    const user = await this.findUserById(userId);

    return user.subscribers;
  }

  async hasUser(hasUserDto: HasUserDto) {
    const { email, username } = hasUserDto;
    return await this.userModel.findOne({ $or: [{ email }, { username }] });
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async getPublicUser(userDto: UserDto) {
    const { _id, username, email, subscriptions, subscribers } = userDto;

    return {
      _id,
      username,
      email,
      subscriptions,
      subscribers,
    };
  }

  async createUser(createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;

    const hashedPassword = await this.hashPassword(password);

    return await this.userModel.create({
      username,
      email,
      password: hashedPassword,
    });
  }

  async getUsers(usersDto: UsersDto) {
    const { page, limit, search } = usersDto;

    const skip = (page - 1) * limit;

    const [{ users, totalCount }] = await this.userModel.aggregate([
      ...(search
        ? [
            {
              $match: {
                username: {
                  $regex: search,
                  $options: 'i',
                },
              },
            },
          ]
        : []),
      {
        $facet: {
          users: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                username: 1,
                subscriptions: 1,
                subscribers: 1,
              },
            },
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
      users,
      page,
      limit,
      pagesCount,
      hasNextPage: page < pagesCount,
    };
  }

  async deleteUser(deleteUserDto: DeleteUserDto) {
    const { userId, refreshToken } = deleteUserDto;

    const user = await this.userModel.findByIdAndRemove(userId);

    const clearSubscription = user.subscriptions.map(async (subscriptionId) => {
      const subscription = await this.findUserById(subscriptionId);

      subscription.subscribers = subscription.subscribers.filter(
        (id) => id.toString() !== userId.toString(),
      );

      await subscription.save();
    });

    await Promise.all(clearSubscription);

    const clearSubscriber = user.subscribers.map(async (subscriberId) => {
      const subscriber = await this.findUserById(subscriberId);

      subscriber.subscriptions = subscriber.subscriptions.filter(
        (id) => id.toString() !== userId.toString(),
      );

      await subscriber.save();
    });

    await Promise.all(clearSubscriber);

    await this.todoModel.deleteMany({ author: userId });

    await this.tokenService.removeToken(refreshToken);
  }

  async toggleSubscribe(toggleSubscribeDto: ToggleSubscribeDto) {
    const { subscriberId, userId } = toggleSubscribeDto;

    const subscriptions = await this.getUserSubscriptions(subscriberId);
    const hasSubscription = subscriptions.includes(userId);

    const subscribers = await this.getUserSubscribers(userId);
    const hasSubscribers = subscribers.includes(subscriberId);

    await this.userModel.findByIdAndUpdate(userId, {
      [`${hasSubscribers ? '$pull' : '$push'}`]: {
        subscribers: subscriberId,
      },
    });

    return await this.userModel.findByIdAndUpdate(
      subscriberId,
      {
        [`${hasSubscription ? '$pull' : '$push'}`]: {
          subscriptions: userId,
        },
      },
      {
        new: true,
      },
    );
  }
}
