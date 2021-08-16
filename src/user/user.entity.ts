import {BeforeInsert, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {AccountTypeEnum} from "../enum/AccountType.enum";
import * as bcrypt from 'bcrypt';
import {UserResponseDto} from "../dto/CreateUser.dto";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    email: string;

    @Column({default: ''})
    name: string;

    @Column({default: ''})
    surname: string;

    @Column({nullable: false})
    password: string;

    @Column({
        type: 'enum',
        enum: AccountTypeEnum, default: AccountTypeEnum.NORMAL
    })
    accountType: AccountTypeEnum;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    static toUserDto = (data: UserEntity): UserResponseDto => {
        const {id, name, surname, accountType, email} = data;
        let userDto: UserResponseDto = {id, name, surname, accountType, email};
        return userDto;
    };
}