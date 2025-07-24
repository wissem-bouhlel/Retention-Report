import { DataSource } from 'typeorm';
import { Appointment } from './entities/Appointment';
import { Employee } from './entities/Employee';
import { Client } from './entities/Salon-client';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './salon.sqlite',
  entities: [Appointment, Client, Employee],
  synchronize: false,
});
