import { Column } from "typeorm";

export class ErrorResponse {
    @Column()
    path: string;

    @Column()
    message: string;
}