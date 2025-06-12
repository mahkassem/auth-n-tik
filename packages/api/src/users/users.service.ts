import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './entities/user.entity';
import { RegisterUserDto, UserProfileDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<UserProfileDto> {
    const { email, password, fullName } = registerUserDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email }).exec();

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new this.userModel({
      email,
      fullName,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    // Return user profile without password
    return {
      id: savedUser._id.toString(),
      email: savedUser.email,
      fullName: savedUser.fullName,
      createdAt: savedUser.createdAt!,
      updatedAt: savedUser.updatedAt!,
    } as UserProfileDto;
  }

  async getProfile(userId: string): Promise<UserProfileDto> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      createdAt: user.createdAt!,
      updatedAt: user.updatedAt!,
    } as UserProfileDto;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }
}
