import {IsNotEmpty, IsOptional, IsString} from "class-validator";
import {AccountTypeEnum} from "../enum/AccountType.enum";

export class CreateUserRequestDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string
}

export class UserResponseDto {


    @IsString()
    id: string;

    @IsString()
    email: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    surname?: string;

    @IsString()
    accountType: AccountTypeEnum;
}