import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './Employee';
import { Client } from './Salon-client';

@Entity('APPOINTMENTS')
export class Appointment {
  @PrimaryGeneratedColumn()
  appointment_id!: number;

  @Column()
  client_id!: number;

  @Column()
  employee_id!: number;

  @Column()
  date!: string;

  @ManyToOne(() => Client, (client: { appointments: any; }) => client.appointments)
  @JoinColumn({ name: 'client_id' })
  client!: Client;

  @ManyToOne(() => Employee, (emp: { appointments: any; }) => emp.appointments)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;
}
