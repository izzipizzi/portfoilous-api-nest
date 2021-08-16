import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {CreateUserRequestDto, UserResponseDto} from "../dto/CreateUser.dto";
import {JwtPayload} from "./jwt.strategy";
import {LoginUserDto} from "../dto/LoginUser.dto";

export interface RegistrationStatus {
    success: boolean;
    message: string;
}

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UserService, private readonly jwtService: JwtService,) {
    }

    async register(userDto: CreateUserRequestDto):
        Promise<RegistrationStatus> {
        let status: RegistrationStatus = {
            success: true,
            message: 'user registered',
        };
        try {
            await this.usersService.create(userDto);
        } catch (err) {
            console.log(err)
            console.log(userDto)
            status = {
                success: false,
                message: err,
            };
        }
        return status;
    }

    async validateUser(payload: JwtPayload): Promise<UserResponseDto> {
        const user = await this.usersService.findByPayload(payload);
        if (!user) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
        return user;
    }

    async login(loginUserDto: LoginUserDto): Promise<any> {
        // find user in db
        const user = await this.usersService.findByLogin(loginUserDto);

        // generate and sign token
        const token = this._createToken(user);

        return {
            email: user.email, ...token,
        };
    }

    private _createToken(dto: UserResponseDto): any {
        const user: JwtPayload = {email: dto.email};
        const accessToken = this.jwtService.sign(user);
        return {
            expiresIn: process.env.EXPIRESIN,
            accessToken,
        };
    }

}
