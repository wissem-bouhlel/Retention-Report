import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Appointment } from './Appointment';

@Entity('EMPLOYEES')
export class Employee {
  @PrimaryGeneratedColumn()
  employee_id!: number;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @OneToMany(() => Appointment, (appt: { employee: any; }) => appt.employee)
  appointments!: Appointment[];
}
