import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateUserRequestDto, UserResponseDto} from "../dto/CreateUser.dto";
import {UserEntity} from "./user.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {LoginUserDto} from "../dto/LoginUser.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) {
    }

    async create(dto: CreateUserRequestDto): Promise<UserResponseDto> {

        // check if the user exists in the db
        const existedUser = await this.userRepo.findOne({
            where: {email: dto.email}
        });
        if (existedUser) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        const user: UserEntity = await this.userRepo.create(dto);
        await this.userRepo.save(user);
        return UserEntity.toUserDto(user);
    }

    async findOne(options?: object): Promise<UserResponseDto> {
        const user = await this.userRepo.findOne(options);
        return UserEntity.toUserDto(user);
    }

    async findByLogin(dto: LoginUserDto): Promise<UserResponseDto> {
        const user = await this.userRepo.findOne({where: dto.email});

        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }

        // compare passwords
        const areEqual = await bcrypt.compare(user.password, dto.password);
        if (!areEqual) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        return UserEntity.toUserDto(user);
    }

    async findByPayload({username}: any): Promise<UserResponseDto> {
        return await this.findOne({
            where: {username}
        });
    }
}
