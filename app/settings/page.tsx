"use client"

import { Sidebar } from "@/components/sidebar"
import { Bell, Globe, Key, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const settingSections = [
    {
      icon: User,
      title: "个人信息",
      description: "管理您的账户信息",
      fields: [
        { label: "姓名", value: "User Name", type: "text" },
        { label: "邮箱", value: "you@example.com", type: "email" },
      ],
    },
    {
      icon: Bell,
      title: "通知设置",
      description: "控制您接收的通知类型",
      toggles: [
        { label: "新意向提醒", enabled: true },
        { label: "每日摘要", enabled: true },
        { label: "周报", enabled: false },
      ],
    },
    {
      icon: Globe,
      title: "监测平台",
      description: "选择要监测的社交平台",
      toggles: [
        { label: "小红书", enabled: true },
        { label: "LinkedIn", enabled: true },
        { label: "X (Twitter)", enabled: true },
        { label: "Reddit", enabled: false },
        { label: "Facebook", enabled: false },
        { label: "Instagram", enabled: false },
      ],
    },
    {
      icon: Key,
      title: "API密钥",
      description: "管理您的API访问权限",
      fields: [{ label: "API Key", value: "sk_test_••••••••••••", type: "password" }],
    },
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-background p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground mb-8">管理您的账户和偏好设置</p>

          <div className="space-y-6">
            {settingSections.map((section) => {
              const Icon = section.icon
              return (
                <div key={section.title} className="bg-white rounded-xl p-6 border">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{section.title}</h3>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                  </div>

                  {section.fields && (
                    <div className="space-y-4">
                      {section.fields.map((field) => (
                        <div key={field.label}>
                          <label className="text-sm font-medium mb-2 block">{field.label}</label>
                          <Input type={field.type} defaultValue={field.value} />
                        </div>
                      ))}
                    </div>
                  )}

                  {section.toggles && (
                    <div className="space-y-3">
                      {section.toggles.map((toggle) => (
                        <div key={toggle.label} className="flex items-center justify-between py-2">
                          <span className="text-sm font-medium">{toggle.label}</span>
                          <Switch defaultChecked={toggle.enabled} />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t flex justify-end">
                    <Button>保存更改</Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
