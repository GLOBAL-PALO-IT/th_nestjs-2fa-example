import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  email: string

  @Column()
  password: string

  @Column({ nullable: true, type: 'text' })
  twoFASecret: string

  @Column({ default: false, type: 'boolean' })
  enable2FA: boolean
}
