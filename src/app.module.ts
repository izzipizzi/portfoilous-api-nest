import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {UserModule} from './user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => {
                return (
                    {
                        type: 'mysql',
                        host: config.get('DATABASE_HOST'),
                        port: config.get('DATABASE_PORT'),
                        username: config.get('DATABASE_USERNAME'),
                        password: config.get('DATABASE_PASSWORD'),
                        database: config.get('DATABASE'),
                        synchronize: true,
                        autoLoadEntities: true,
                    }
                )
            },
            inject: [ConfigService],
        }), UserModule, AuthModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
