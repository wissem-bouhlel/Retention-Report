import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Appointment } from './Appointment';

@Entity('CLIENTS')
export class Client {
  @PrimaryGeneratedColumn()
  client_id!: number;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @Column()
  gender!: string;

  @OneToMany(() => Appointment, (appt: { client: any; }) => appt.client)
  appointments!: Appointment[];
}
