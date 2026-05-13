import jwt from 'jsonwebtoken';
import { UserRepository } from '../user/user.repository';
import { ApiError } from '../../shared/errors/ApiError';
import { IUser } from '../user/user.model';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  private signToken(id: string): string {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  async register(userData: any) {
    const existingUser = await this.userRepository.findByPhone(userData.phone);
    if (existingUser) {
      throw new ApiError('Phone number already registered', 400);
    }

    const user = await this.userRepository.create(userData);
    const token = this.signToken(user._id as string);

    return { user, token };
  }

  async login(phone: string, password?: string) {
    const user = await this.userRepository.findByPhone(phone);

    if (!user || (password && !(await user.comparePassword(password)))) {
      throw new ApiError('Invalid phone number or password', 401);
    }

    const token = this.signToken(user._id as string);
    return { user, token };
  }
}
