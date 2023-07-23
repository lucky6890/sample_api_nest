import { Report } from 'src/reports/report.entity';
import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with ID: ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with ID: ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with ID: ', this.id);
  }
}
