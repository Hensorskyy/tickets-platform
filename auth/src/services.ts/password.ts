import { randomBytes, scryptSync } from 'crypto'

export class Password {
  static toHash(password: string) {
    const salt = randomBytes(8).toString('hex')
    const buff = scryptSync(password, salt, 64)

    return `${buff.toString('hex')}.${salt}`
  }

  static compare(storedPassword: string, suppliedPassword: string) {
    const [hashedStored, salt] = storedPassword.split('.')

    const buff = scryptSync(suppliedPassword, salt, 64)

    return buff.toString('hex') === hashedStored
  }
}