import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function checkConnection() {
  const user = await prisma.user.create({
    data: {
      email: "aaidark1@swarthmore.edu",
      name: "Amirkhan",
      password: "Password",
      createdAt: new Date('2024-05-24'),
    }
  })
  console.log(user)
}

checkConnection()