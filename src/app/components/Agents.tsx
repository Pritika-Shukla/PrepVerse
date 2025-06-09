'use client'
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react"

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface AgentProps {
  userName: string
}

const Agent = ({ userName }: AgentProps) => {
  const callStatus = CallStatus.FINISHED
  const isSpeaking = true
  const messages = ["What's your name?", "My name is John Doe, nice to meet you!"]
  const lastMessage = messages[messages.length - 1]

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">AI Interview Session</h1>
          <div className="flex items-center justify-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                callStatus === "ACTIVE"
                  ? "bg-green-500 animate-pulse"
                  : callStatus === "CONNECTING"
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-gray-500",
              )}
            />
            <span className="text-sm text-gray-400 capitalize">{callStatus.toLowerCase()}</span>
          </div>
        </div>

        {/* Main Interview Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* AI Interviewer Card */}
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 p-1">
                  <Image
                    src="/placeholder.svg?height=96&width=96"
                    alt="AI Interviewer"
                    width={96}
                    height={96}
                    className="w-full h-full rounded-full object-cover bg-zinc-800"
                  />
                </div>
                {isSpeaking && (
                  <div className="absolute -bottom-1 -right-1">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                      <Mic className="w-3 h-3 text-white" />
                    </div>
                    <div className="absolute inset-0 w-6 h-6 bg-green-500 rounded-full animate-ping opacity-75" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">AI Interviewer</h3>
              <p className="text-sm text-gray-400">Conducting your interview</p>
            </div>
          </div>

          {/* User Card */}
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 p-1">
                  <Image
                    src="/placeholder.svg?height=96&width=96"
                    alt="User"
                    width={96}
                    height={96}
                    className="w-full h-full rounded-full object-cover bg-gray-700"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-900">
                    {callStatus === "ACTIVE" ? (
                      <Mic className="w-3 h-3 text-gray-300" />
                    ) : (
                      <MicOff className="w-3 h-3 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{userName}</h3>
              <p className="text-sm text-gray-400">Interviewee</p>
            </div>
          </div>
        </div>

        {/* Transcript */}
        {messages.length > 0 && (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            <div className="bg-zinc-800 px-4 py-3 border-b border-zinc-700">
              <h4 className="font-medium text-white">Live Transcript</h4>
            </div>
            <div className="p-4 min-h-[100px] max-h-[200px] overflow-y-auto">
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-3 rounded-lg max-w-[80%]",
                      index % 2 === 0 ? "bg-zinc-800 text-white ml-auto" : "bg-zinc-800 text-zinc-200",
                    )}
                  >
                    <p className="text-sm">{message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="flex justify-center pt-4">
          {callStatus !== "ACTIVE" ? (
            <button
              className={cn(
                "flex items-center gap-3 px-8 py-4 rounded-full font-medium text-white transition-all duration-200",
                "bg-green-600 hover:bg-green-700 active:scale-95",
                "shadow-lg hover:shadow-green-600/25",
                callStatus === "CONNECTING" && "animate-pulse",
              )}
            >
              {callStatus === "CONNECTING" && (
                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />
              )}
              <Phone className="w-5 h-5" />
              <span className="text-base">
                {callStatus === "INACTIVE" || callStatus === "FINISHED" ? "Start Interview" : "Connecting..."}
              </span>
            </button>
          ) : (
            <button
              className={cn(
                "flex items-center gap-3 px-8 py-4 rounded-full font-medium text-white transition-all duration-200",
                "bg-red-600 hover:bg-red-700 active:scale-95",
                "shadow-lg hover:shadow-red-600/25",
              )}
            >
              <PhoneOff className="w-5 h-5" />
              <span className="text-base">End Interview</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Agent
