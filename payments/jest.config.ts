import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  setupFilesAfterEnv: [
    './src/test/setup.ts'
  ]
}

export default jestConfig