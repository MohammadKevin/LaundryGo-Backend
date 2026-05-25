const { PrismaClient, Role } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash(
    process.env.SUPER_ADMIN_PASSWORD,
    10,
  )

  const superAdmin = await prisma.user.upsert({
    where: {
      email: process.env.SUPER_ADMIN_EMAIL,
    },
    update: {},
    create: {
      name: process.env.SUPER_ADMIN_NAME,
      email: process.env.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      phone: process.env.SUPER_ADMIN_PHONE,
      role: Role.SUPER_ADMIN,
    },
  })

  console.log('✅ Super Admin Created')
  console.log(superAdmin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
})
