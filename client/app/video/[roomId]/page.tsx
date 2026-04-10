"use client"

import { useEffect, useRef, useState, use } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import API from "@/services/api"
import { toast } from "sonner"
import { Loader2, PhoneOff, Video, Mic, MicOff, VideoOff, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VideoCallPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [appointment, setAppointment] = useState<any>(null)
  const [isJoined, setIsJoined] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const zpRef = useRef<any>(null)

  const APP_ID = 1428117892
  const SERVER_SECRET = "80187285c383cc7a814d8beb477009fb"

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to access the video call")
      router.push("/login")
      return
    }

    const fetchAppointmentAndJoin = async () => {
      try {
        const response = await API.get(`/appointments/${roomId}`)
        const data = response.data

        if (data.status !== "accepted") {
          toast.error("Video call is only available for accepted appointments")
          router.push("/dashboard")
          return
        }

        setAppointment(data)
        
        // Dynamic import to avoid SSR issues with ZegoCloud
        const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt")
        
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          APP_ID,
          SERVER_SECRET,
          roomId,
          user!._id,
          user!.name
        )

        const zp = ZegoUIKitPrebuilt.create(kitToken)
        zpRef.current = zp

        zp.joinRoom({
          container: containerRef.current,
          sharedLinks: [
            {
              name: "Personal link",
              url: window.location.protocol + "//" + window.location.host + window.location.pathname,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showScreenSharingButton: true,
          showPreJoinView: true,
          onJoinRoom: () => {
            setIsJoined(true)
            toast.success("Joined video consultation")
          },
          onLeaveRoom: () => {
            router.push("/dashboard")
          },
        })
      } catch (error: any) {
        console.error("Video call error:", error)
        toast.error(error.response?.data?.message || "Failed to initialize video call")
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    if (user && roomId) {
      fetchAppointmentAndJoin()
    }

    return () => {
      if (zpRef.current) {
        // Zego doesn't have a direct destroy method in some versions but leaving room is handled
      }
    }
  }, [user, authLoading, roomId, router])

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-semibold">Preparing Video Consultation...</h2>
        <p className="text-muted-foreground mt-2">Setting up your secure room</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-950 overflow-hidden">
      {/* Header */}
      {!isJoined && (
        <div className="flex items-center justify-between p-4 bg-neutral-900 border-b border-neutral-800 z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Video className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-white font-medium">Video Consultation</h1>
              <p className="text-neutral-400 text-xs">Room ID: {roomId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 rounded-full border border-neutral-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-white text-xs font-medium">Waiting for other participant...</span>
          </div>
        </div>
      )}

      {/* Main Video Container */}
      <div className="flex-1 relative w-full h-full">
        <div 
          ref={containerRef} 
          className="w-full h-full zego-container"
          style={{ width: '100vw', height: '100vh' }}
        />
        
        {/* Fallback/Overlay when not in full screen mode or if UI is custom */}
        {!isJoined && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-neutral-900/80 backdrop-blur-md p-8 rounded-2xl border border-neutral-800 flex flex-col items-center text-center max-w-md mx-4 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <Users className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Secure Connection Ready</h2>
                    <p className="text-neutral-400 mb-6">
                        Consultation with {user?.role === 'lawyer' ? appointment?.user?.name : appointment?.lawyer?.user?.name}. 
                        Please ensure your camera and microphone are accessible.
                    </p>
                    <div className="flex items-center gap-2 text-primary font-medium">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Initializing Encrypted Feed...</span>
                    </div>
                </div>
            </div>
        )}
      </div>

      <style jsx global>{`
        .zego-container .zego-preview-video {
            border-radius: 12px !important;
            overflow: hidden !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
        }
        .zego-container button {
            transition: all 0.2s ease !important;
        }
        .zego-container button:hover {
            transform: scale(1.05) !important;
        }
      `}</style>
    </div>
  )
}
