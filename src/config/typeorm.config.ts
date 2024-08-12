import { TypeOrmModuleOptions } from '@nestjs/typeorm';
    
export const typeormConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'voting_app',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true, 
};   
