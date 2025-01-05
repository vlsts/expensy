import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    findAll(): string {
        return 'This action returns all users';
    }

    @Post()
    async create(@Body() createCatDto: CreateUserDto): Promise<User> {
        return this.userService.create(createCatDto);
    }
}
