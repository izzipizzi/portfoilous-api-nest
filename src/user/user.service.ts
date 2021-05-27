import { Injectable } from '@nestjs/common';
import {Model} from "mongoose";
import {User, UserDocument} from "./user.schema";
import {InjectModel} from "@nestjs/mongoose";

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private catModel: Model<UserDocument>) {}

    async createUser (dto: CreateUserDto) {

    }

}
