import type { System, Article, User, Question, Answer, Banner } from '@/types'

export const banners: Banner[] = [
  {
    id: 1,
    title: '关于开展2026年第一季度系统维护的通知',
    image: 'https://picsum.photos/1200/400?random=1',
    link: '/news/1',
    type: 'notice'
  },
  {
    id: 2,
    title: 'ERP系统升级公告',
    image: 'https://picsum.photos/1200/400?random=2',
    link: '/news/2',
    type: 'system'
  },
  {
    id: 3,
    title: '信息安全培训报名通知',
    image: 'https://picsum.photos/1200/400?random=3',
    link: '/news/3',
    type: 'activity'
  }
]

export const systems: System[] = [
  {
    id: 1,
    name: '集团ERP系统',
    code: 'ERP',
    category: '核心系统',
    description: '承载集团财务、采购、库存、生产制造等核心业务流程，日均处理业务单据超过10万笔。',
    manager: '张明华',
    managerPhone: '8001',
    department: '信息技术部',
    docLinks: [
      { name: '操作手册', url: '/knowledge/1' },
      { name: '运维指南', url: '/knowledge/2' },
      { name: '常见问题', url: '/qa?system=ERP' }
    ],
    status: 'online',
    createdAt: '2024-01-01',
    updatedAt: '2026-03-15'
  },
  {
    id: 2,
    name: 'OA办公系统',
    code: 'OA',
    category: '核心系统',
    description: '支持公文流转、审批流程、会议管理、日程安排等办公自动化功能。',
    manager: '李芳',
    managerPhone: '8002',
    department: '信息技术部',
    docLinks: [
      { name: '操作手册', url: '/knowledge/3' },
      { name: '流程配置', url: '/knowledge/4' }
    ],
    status: 'online',
    createdAt: '2024-01-01',
    updatedAt: '2026-03-10'
  },
  {
    id: 3,
    name: 'CRM客户管理系统',
    code: 'CRM',
    category: '核心系统',
    description: '管理客户信息、销售线索、商机跟踪、售后服务等客户关系全生命周期。',
    manager: '王强',
    managerPhone: '8003',
    department: '信息技术部',
    docLinks: [
      { name: '用户指南', url: '/knowledge/5' }
    ],
    status: 'online',
    createdAt: '2024-03-01',
    updatedAt: '2026-02-28'
  },
  {
    id: 4,
    name: '数据中心基础设施',
    code: 'DC',
    category: '基础设施',
    description: '承载集团核心业务系统的高可用数据中心，包含服务器、存储、网络等基础设施。',
    manager: '赵伟',
    managerPhone: '8004',
    department: '信息技术部',
    docLinks: [
      { name: '运维手册', url: '/knowledge/6' },
      { name: '应急预案', url: '/knowledge/7' }
    ],
    status: 'online',
    createdAt: '2024-01-01',
    updatedAt: '2026-03-01'
  },
  {
    id: 5,
    name: '堡垒机系统',
    code: 'Bastion',
    category: '安全系统',
    description: '统一运维审计平台，实现对服务器、网络设备的安全访问控制和操作审计。',
    manager: '刘杰',
    managerPhone: '8005',
    department: '信息安全部',
    docLinks: [
      { name: '运维指南', url: '/knowledge/8' }
    ],
    status: 'online',
    createdAt: '2024-02-01',
    updatedAt: '2026-02-20'
  },
  {
    id: 6,
    name: '供应链管理系统',
    code: 'SCM',
    category: '核心系统',
    description: '管理供应商、采购、仓储、物流等供应链全流程业务。',
    manager: '陈静',
    managerPhone: '8006',
    department: '信息技术部',
    docLinks: [
      { name: '操作指南', url: '/knowledge/9' }
    ],
    status: 'maintenance',
    createdAt: '2024-04-01',
    updatedAt: '2026-03-18'
  }
]

export const users: User[] = [
  {
    id: 1,
    username: 'admin',
    nickname: '张明华',
    avatar: 'https://picsum.photos/100/100?random=10',
    role: 'admin',
    phone: '8001',
    email: 'zhangmh@example.com',
    department: '信息技术部',
    title: '运维主管',
    expertise: ['网络', '系统架构', '运维自动化'],
    status: 'online'
  },
  {
    id: 2,
    username: 'wangfang',
    nickname: '王芳',
    avatar: 'https://picsum.photos/100/100?random=11',
    role: 'it',
    phone: '8002',
    email: 'wangfang@example.com',
    department: '信息技术部',
    title: '系统工程师',
    expertise: ['数据库', '中间件', '性能优化'],
    status: 'online'
  },
  {
    id: 3,
    username: 'zhaoqiang',
    nickname: '赵强',
    avatar: 'https://picsum.photos/100/100?random=12',
    role: 'it',
    phone: '8003',
    email: 'zhaoq@example.com',
    department: '信息安全部',
    title: '安全工程师',
    expertise: ['网络安全', '渗透测试', '安全合规'],
    status: 'online'
  },
  {
    id: 4,
    username: 'qianwei',
    nickname: '钱伟',
    avatar: 'https://picsum.photos/100/100?random=13',
    role: 'it',
    phone: '8004',
    email: 'qianw@example.com',
    department: '信息技术部',
    title: '应用运维工程师',
    expertise: ['中间件', '应用部署', '故障排查'],
    status: 'offline'
  },
  {
    id: 5,
    username: 'sunlei',
    nickname: '孙磊',
    avatar: 'https://picsum.photos/100/100?random=14',
    role: 'it',
    phone: '8005',
    email: 'sunl@example.com',
    department: '信息技术部',
    title: '数据库工程师',
    expertise: ['Oracle', 'MySQL', '数据备份'],
    status: 'online'
  },
  {
    id: 6,
    username: 'zhouyan',
    nickname: '周艳',
    avatar: 'https://picsum.photos/100/100?random=15',
    role: 'it',
    phone: '8006',
    email: 'zhouy@example.com',
    department: '信息技术部',
    title: 'IT支持工程师',
    expertise: ['桌面支持', 'HelpDesk', '用户培训'],
    status: 'online'
  }
]

export const articles: Article[] = [
  {
    id: 1,
    title: 'ERP系统日常操作指南',
    content: '<h2>概述</h2><p>本文档详细介绍XXX系统的日常操作流程...</p><h2>登录系统</h2><p>访问地址：erp.example.com</p>',
    type: 'knowledge',
    systemId: 1,
    author: '张明华',
    authorId: 1,
    tags: ['ERP', '操作指南', '入门'],
    attachments: [
      { id: 1, fileName: 'ERP操作手册.pdf', filePath: '/uploads/erp-guide.pdf', fileSize: 2048576, fileType: 'application/pdf' }
    ],
    views: 1520,
    likes: 45,
    status: 'published',
    createdAt: '2026-01-15',
    updatedAt: '2026-03-10'
  },
  {
    id: 2,
    title: '服务器巡检标准流程',
    content: '<h2>巡检目的</h2><p>确保服务器稳定运行，及时发现并处理潜在问题...</p>',
    type: 'knowledge',
    author: '王芳',
    authorId: 2,
    tags: ['运维', '巡检', '服务器'],
    attachments: [],
    views: 890,
    likes: 32,
    status: 'published',
    createdAt: '2026-02-01',
    updatedAt: '2026-02-28'
  },
  {
    id: 3,
    title: '关于开展2026年第一季度系统维护的通知',
    content: '<h2>维护时间</h2><p>2026年3月20日 18:00 - 22:00</p><h2>维护范围</h2><p>ERP系统、OA系统、CRM系统</p>',
    type: 'news',
    author: '张明华',
    authorId: 1,
    tags: ['通知', '系统维护', '2026Q1'],
    attachments: [],
    views: 2340,
    likes: 78,
    status: 'published',
    createdAt: '2026-03-15',
    updatedAt: '2026-03-15'
  },
  {
    id: 4,
    title: '网络安全防护措施升级公告',
    content: '<h2>升级内容</h2><p>为提升网络安全防护能力，信息技术部将于近期对防火墙、入侵检测系统进行全面升级...</p>',
    type: 'news',
    author: '赵强',
    authorId: 3,
    tags: ['安全', '网络', '升级公告'],
    attachments: [],
    views: 1650,
    likes: 56,
    status: 'published',
    createdAt: '2026-03-10',
    updatedAt: '2026-03-10'
  }
]

export const questions: Question[] = [
  {
    id: 1,
    title: 'ERP系统登录提示"会话超时"怎么解决？',
    content: '每天首次登录ERP系统时，经常提示"会话超时"，需要重新输入用户名密码，影响工作效率。',
    authorId: 101,
    author: '市场部-李明',
    authorAvatar: 'https://picsum.photos/50/50?random=20',
    tags: ['ERP', '登录问题'],
    answerCount: 3,
    views: 456,
    likes: 12,
    hasAcceptedAnswer: true,
    createdAt: '2026-03-15',
    updatedAt: '2026-03-16'
  },
  {
    id: 2,
    title: 'OA审批流程如何加签？',
    content: '有一个审批流程需要临时增加审批人，请问如何在流程进行中加签？',
    authorId: 102,
    author: '人力资源部-王小红',
    authorAvatar: 'https://picsum.photos/50/50?random=21',
    tags: ['OA', '审批流程'],
    answerCount: 2,
    views: 234,
    likes: 8,
    hasAcceptedAnswer: false,
    createdAt: '2026-03-14',
    updatedAt: '2026-03-15'
  },
  {
    id: 3,
    title: 'VPN连接不稳定怎么排查？',
    content: '在家办公时VPN经常断线，有什么排查方法吗？',
    authorId: 103,
    author: '销售部-张强',
    authorAvatar: 'https://picsum.photos/50/50?random=22',
    tags: ['VPN', '网络', '远程办公'],
    answerCount: 5,
    views: 678,
    likes: 23,
    hasAcceptedAnswer: true,
    createdAt: '2026-03-12',
    updatedAt: '2026-03-14'
  }
]

export const answers: Answer[] = [
  {
    id: 1,
    questionId: 1,
    content: '<p>这个问题通常是由于浏览器缓存导致的。建议：</p><ol><li>清除浏览器缓存和Cookie</li><li>尝试使用Chrome或Edge浏览器</li><li>检查电脑时间是否与服务器同步</li></ol>',
    authorId: 1,
    author: '张明华',
    authorAvatar: 'https://picsum.photos/50/50?random=10',
    isAccepted: true,
    likes: 15,
    createdAt: '2026-03-15'
  },
  {
    id: 2,
    questionId: 1,
    content: '<p>另外，如果公司网络做了策略限制，可能需要联系IT部门检查是否对您的电脑做了安全策略配置。</p>',
    authorId: 2,
    author: '王芳',
    authorAvatar: 'https://picsum.photos/50/50?random=11',
    isAccepted: false,
    likes: 8,
    createdAt: '2026-03-16'
  },
  {
    id: 3,
    questionId: 3,
    content: '<p>VPN连接不稳定的排查步骤：</p><ol><li>检查本地网络是否稳定</li><li>尝试切换VPN接入点</li><li>关闭本地防火墙测试</li><li>更新VPN客户端版本</li></ol>',
    authorId: 3,
    author: '赵强',
    authorAvatar: 'https://picsum.photos/50/50?random=12',
    isAccepted: true,
    likes: 22,
    createdAt: '2026-03-13'
  }
]

export const dutySchedule = [
  { day: '周一', person: '张明华', phone: '8001' },
  { day: '周二', person: '王芳', phone: '8002' },
  { day: '周三', person: '赵强', phone: '8003' },
  { day: '周四', person: '钱伟', phone: '8004' },
  { day: '周五', person: '全员值班', phone: '-' }
]
