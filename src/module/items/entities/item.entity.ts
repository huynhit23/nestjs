import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm'
import { Poll } from 'src/module/poll/entities/poll.entity'
import { Vote } from 'src/module/vote/entities/vote.entity'
 
@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar' })
    name: string

    @Column({ type: 'varchar'})
    image: string

    @Column()
    age: number

    @Column('text')
    description: string

    @Column({ type: 'varchar'})
    address: string

    @Column({unique: true})
    phone: number

    @Column({ type: 'tinyint', default: 0})
    status: number

    @Column()
    pollId: number;

    @ManyToOne(()=>  Poll, (poll) => poll.id, { onDelete: 'CASCADE' })
    poll: Poll;

    @Column(() => Vote[''])
    @OneToMany(() => Vote, vote => vote.item)
    votes: Vote[];

    @Column({default: () => 0 })
    voteQtt: number
    
    
    @Column({ type: 'datetime',   default: () => 'NOW()' })
    created_at: Date; 

    @Column({ type: 'datetime', nullable: true })
    update_at: Date;

    @Column({ type: 'datetime', nullable: true })
    delete_at: Date;

}
 