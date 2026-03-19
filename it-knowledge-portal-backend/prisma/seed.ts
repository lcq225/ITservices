import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const adminPassword = await bcrypt.hash('admin123', 10)
  const itPassword = await bcrypt.hash('it123456', 10)

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      nickname: '系统管理员',
      role: 'ADMIN',
      email: 'admin@example.com',
      department: '信息技术部',
      title: '系统管理员'
    }
  })

  const itUser1 = await prisma.user.upsert({
    where: { username: 'zhangmh' },
    update: {},
    create: {
      username: 'zhangmh',
      password: itPassword,
      nickname: '张明华',
      role: 'IT',
      email: 'zhangmh@example.com',
      phone: '8001',
      department: '信息技术部',
      title: '运维主管',
      expertise: ['网络', '系统架构', '运维自动化']
    }
  })

  const itUser2 = await prisma.user.upsert({
    where: { username: 'wangfang' },
    update: {},
    create: {
      username: 'wangfang',
      password: itPassword,
      nickname: '王芳',
      role: 'IT',
      email: 'wangfang@example.com',
      phone: '8002',
      department: '信息技术部',
      title: '系统工程师',
      expertise: ['数据库', '中间件', '性能优化']
    }
  })

  const system1 = await prisma.system.upsert({
    where: { code: 'ERP' },
    update: {},
    create: {
      name: '集团ERP系统',
      code: 'ERP',
      category: '核心系统',
      description: '承载集团财务、采购、库存、生产制造等核心业务流程，日均处理业务单据超过10万笔。',
      managerId: itUser1.id,
      status: 'ONLINE',
      docLinks: [
        { name: '操作手册', url: '/docs/erp-guide' },
        { name: '运维指南', url: '/docs/erp-ops' }
      ]
    }
  })

  const system2 = await prisma.system.upsert({
    where: { code: 'OA' },
    update: {},
    create: {
      name: 'OA办公系统',
      code: 'OA',
      category: '核心系统',
      description: '支持公文流转、审批流程、会议管理、日程安排等办公自动化功能。',
      managerId: itUser2.id,
      status: 'ONLINE',
      docLinks: [
        { name: '操作手册', url: '/docs/oa-guide' }
      ]
    }
  })

  await prisma.article.createMany({
    data: [
      {
        title: 'ERP系统日常操作指南',
        content: '<h2>概述</h2><p>本文档详细介绍ERP系统的日常操作流程...</p>',
        type: 'KNOWLEDGE',
        systemId: system1.id,
        authorId: itUser1.id,
        tags: ['ERP', '操作指南', '入门'],
        status: 'PUBLISHED',
        views: 1520,
        likes: 45
      },
      {
        title: '服务器巡检标准流程',
        content: '<h2>巡检目的</h2><p>确保服务器稳定运行，及时发现并处理潜在问题...</p>',
        type: 'KNOWLEDGE',
        authorId: itUser2.id,
        tags: ['运维', '巡检', '服务器'],
        status: 'PUBLISHED',
        views: 890,
        likes: 32
      },
      {
        title: '关于开展2026年第一季度系统维护的通知',
        content: '<h2>维护时间</h2><p>2026年3月20日 18:00 - 22:00</p>',
        type: 'NEWS',
        authorId: admin.id,
        tags: ['通知', '系统维护', '2026Q1'],
        status: 'PUBLISHED',
        views: 2340,
        likes: 78
      }
    ],
    skipDuplicates: true
  })

  await prisma.question.createMany({
    data: [
      {
        title: 'ERP系统登录提示"会话超时"怎么解决？',
        content: '每天首次登录ERP系统时，经常提示"会话超时"，需要重新输入用户名密码，影响工作效率。',
        authorId: admin.id,
        tags: ['ERP', '登录问题'],
        answerCount: 2,
        views: 456,
        likes: 12,
        hasAcceptedAnswer: true
      },
      {
        title: 'OA审批流程如何加签？',
        content: '有一个审批流程需要临时增加审批人，请问如何在流程进行中加签？',
        authorId: admin.id,
        tags: ['OA', '审批流程'],
        answerCount: 1,
        views: 234,
        likes: 8
      }
    ],
    skipDuplicates: true
  })

  console.log('Database seeded successfully!')
  console.log('')
  console.log('Test accounts:')
  console.log('  Admin: admin / admin123')
  console.log('  IT User: zhangmh / it123456')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
