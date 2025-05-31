'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronRight, Brain, TrendingUp, Award, BarChart3, BookOpen, Target, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  const [authOpen, setAuthOpen] = useState(false)
  const router = useRouter()

  const handleGuestAccess = () => {
    setAuthOpen(false)
    router.push('/dashboard')
  }

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Interactive Learning",
      description: "Click on real stock charts to predict market movements based on actual events"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Real Historical Data", 
      description: "Learn from genuine market events and see how professionals analyze trends"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "AI-Powered Feedback",
      description: "Get intelligent explanations of market patterns and investment principles"
    }
  ]

  const stats = [
    { number: "500+", label: "Historical Events" },
    { number: "85%", label: "User Accuracy Improvement" },
    { number: "15min", label: "Average Learning Session" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF8] via-[#fef7e6] to-[#fdf1d1]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#DA9B3C]/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-[#DA9B3C]" />
            <span className="text-2xl font-bold text-[#333]">Fetch.AI</span>
          </div>
          <Button 
            onClick={() => router.push('/quiz')}
            className="bg-[#DA9B3C] hover:bg-[#c8892d] text-white"
          >
            Start Learning
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#DA9B3C]/10 text-[#DA9B3C] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Interactive Financial Education
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-[#333] mb-6">
            Learn to Think Like an
            <span className="text-[#DA9B3C] block">Investor</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Master financial markets through interactive quizzes with real historical data. 
            Predict stock movements, get AI feedback, and build your investment intuition.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => router.push('/quiz')}
              size="lg"
              className="bg-[#DA9B3C] hover:bg-[#c8892d] text-white text-lg px-8 py-6"
            >
              Start Quiz
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-[#DA9B3C] text-[#DA9B3C] hover:bg-[#DA9B3C] hover:text-white text-lg px-8 py-6"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              How It Works
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-[#DA9B3C] mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333] mb-4">
            Why Fetch.AI Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Traditional finance education is boring. We make it interactive, practical, and fun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#DA9B3C]/10 rounded-lg text-[#DA9B3C]">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333] mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Learn by doing, not just reading
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "See Real Event", desc: "Historical news or market event" },
              { step: "2", title: "Analyze Chart", desc: "View the stock price leading up to the event" },
              { step: "3", title: "Make Prediction", desc: "Click where you think the price went" },
              { step: "4", title: "Learn & Improve", desc: "Get AI feedback and explanation" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-[#DA9B3C] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#DA9B3C] to-[#c8892d] py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <Target className="h-12 w-12 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Think Like a Pro?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands learning to make smarter investment decisions through interactive practice.
          </p>
          <Button 
            onClick={() => router.push('/quiz')}
            size="lg"
            className="bg-white text-[#DA9B3C] hover:bg-gray-100 text-lg px-8 py-6"
          >
            Start Your First Quiz
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#333] text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 className="h-6 w-6 text-[#DA9B3C]" />
            <span className="text-xl font-bold">Fetch.AI</span>
          </div>
          <p className="text-gray-400">
            Making financial education interactive and accessible for everyone.
          </p>
        </div>
      </footer>
    </div>
  )
}
