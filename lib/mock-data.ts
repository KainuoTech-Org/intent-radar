export interface Intent {
  id: string
  platform: "xiaohongshu" | "linkedin" | "x" | "telegram" | "reddit" | "facebook" | "instagram"
  avatar: string
  author: string
  timeAgo: string
  content: string
  intentScore: number
  sourceUrl: string
  timestamp: Date
  topComment?: {
    author: string
    content: string
  }
}

export const DEMO_INTENTS: Intent[] = [
  {
    id: "1",
    platform: "xiaohongshu",
    avatar: "https://unavatar.io/twitter/alexchen",
    author: "Alex Chen",
    timeAgo: "2小时前",
    content: "香港这边需要找个全栈开发，做B2B SaaS项目，有React和Node经验的联系我！预算充足💰",
    intentScore: 95,
    sourceUrl: "https://www.xiaohongshu.com/explore/65f3a2b1000000001e03f4d2",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    topComment: {
      author: "TechHunter",
      content: "已私信，我有5年React经验，目前在香港。",
    },
  },
  {
    id: "2",
    platform: "linkedin",
    avatar: "https://unavatar.io/github/sarahliu",
    author: "Sarah Liu",
    timeAgo: "5 hours ago",
    content:
      "Hiring full-stack developer for our fintech startup in Hong Kong. Must have experience with Next.js and PostgreSQL. DM me! #hiring #tech #hongkong",
    intentScore: 92,
    sourceUrl: "https://www.linkedin.com/posts/sarahliu_hiring-tech-hongkong-activity-7150234567890123456",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    topComment: {
      author: "John Doe",
      content: "Interested! Just sent you my portfolio.",
    },
  },
  {
    id: "3",
    platform: "x",
    avatar: "https://unavatar.io/twitter/mikerodr",
    author: "Mike Rodriguez",
    timeAgo: "1 day ago",
    content:
      "Looking for a freelance UI/UX designer for a mobile app project. Experience with Figma required. Budget: $5k-8k. Reply or DM! 🎨",
    intentScore: 88,
    sourceUrl: "https://x.com/mikerodr/status/1750123456789012345",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    platform: "telegram",
    avatar: "https://unavatar.io/telegram/davidwong",
    author: "David Wong",
    timeAgo: "6 hours ago",
    content:
      "Need backend engineer for crypto project in HK. Golang + microservices exp required. Good compensation package 🚀",
    intentScore: 90,
    sourceUrl: "https://t.me/hktechcommunity/45678",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: "5",
    platform: "reddit",
    avatar: "https://unavatar.io/reddit/tech_recruiter_hk",
    author: "u/tech_recruiter_hk",
    timeAgo: "3 hours ago",
    content:
      "Our company is seeking a senior React developer for a 6-month contract. Remote friendly, must be available HKT timezone. Competitive rates!",
    intentScore: 87,
    sourceUrl: "https://reddit.com/r/hongkong/comments/1b2c3d4/hiring_senior_react_developer",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: "6",
    platform: "linkedin",
    avatar: "https://unavatar.io/github/emilyzhang",
    author: "Emily Zhang",
    timeAgo: "12 hours ago",
    content:
      "Startup founder looking for technical co-founder. Experience with AI/ML and web development. Equity-based compensation. Let's build something amazing! 🚀",
    intentScore: 85,
    sourceUrl: "https://www.linkedin.com/posts/emilyzhang_startup-cofounder-ai-activity-7149876543210987654",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: "7",
    platform: "xiaohongshu",
    avatar: "https://unavatar.io/twitter/lisawang",
    author: "Lisa Wang",
    timeAgo: "8小时前",
    content: "需要会React Native的移动端开发，做电商app，项目周期3个月，有兴趣的私信报价～",
    intentScore: 83,
    sourceUrl: "https://www.xiaohongshu.com/explore/65f3a2b1000000001e03f4d3",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: "8",
    platform: "x",
    avatar: "https://unavatar.io/twitter/jamestech",
    author: "James Tech",
    timeAgo: "2 days ago",
    content:
      "Building an AI analytics platform. Need data engineers with Python/SQL expertise. Remote OK. Ping me if interested! 📊",
    intentScore: 91,
    sourceUrl: "https://x.com/jamestech/status/1749012345678901234",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
  {
    id: "9",
    platform: "facebook",
    avatar: "https://unavatar.io/facebook/rachelkim",
    author: "Rachel Kim",
    timeAgo: "4 hours ago",
    content:
      "Anyone know a good WordPress developer? Client needs e-commerce site built ASAP. Please tag or message me!",
    intentScore: 78,
    sourceUrl: "https://facebook.com/rachelkim/posts/123456789",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "10",
    platform: "instagram",
    avatar: "https://unavatar.io/instagram/designstudio_hk",
    author: "designstudio_hk",
    timeAgo: "1 day ago",
    content:
      "Looking for frontend dev to collaborate on client projects. Must know Tailwind CSS and have good design sense ✨",
    intentScore: 80,
    sourceUrl: "https://instagram.com/p/C3D4E5F6G7H",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
]
