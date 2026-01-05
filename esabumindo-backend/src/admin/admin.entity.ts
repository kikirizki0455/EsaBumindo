import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admins')
export class admins {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
