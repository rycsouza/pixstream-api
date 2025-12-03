import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<User> {
    const user = this.userRepository.create({
      email: data.email,
      passwordHash: data.password,
      name: data.name,
      role: UserRole.CREATOR,
      isActive: true,
    });

    return this.userRepository.save(user);
  }
}
