"use client"

import { Cta } from '@/components/cta-button'
import { TextEffect } from '@/components/text-effect'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react';
import Link from 'next/link'


const Hero = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [activeVideo, setActiveVideo] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Handle responsive layout
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    // Set up video playback
    const setupVideoPlayback = () => {
      const video1 = video1Ref.current
      const video2 = video2Ref.current

      if (!video1 || !video2) return

      // Start the first video immediately
      video1.play().catch(e => console.error('Error playing video 1:', e))

      // Set up event listeners for transition
      const handleTimeUpdate = () => {
        const video = activeVideo === 1 ? video1 : video2

        // Start transition when approaching the end (last 2.5 seconds)
        // This gives enough time for a smooth transition
        if (!isTransitioning && video.currentTime >= video.duration - 2.5) {
          startTransition()
        }
      }

      video1.addEventListener('timeupdate', handleTimeUpdate)
      video2.addEventListener('timeupdate', handleTimeUpdate)

      return () => {
        video1.removeEventListener('timeupdate', handleTimeUpdate)
        video2.removeEventListener('timeupdate', handleTimeUpdate)
      }
    }

    const cleanup = setupVideoPlayback()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (cleanup) cleanup()
    }
  }, [activeVideo, isTransitioning])

  // Function to handle the transition between videos
  const startTransition = () => {
    setIsTransitioning(true)

    const currentVideo = activeVideo === 1 ? video1Ref.current : video2Ref.current
    const nextVideo = activeVideo === 1 ? video2Ref.current : video1Ref.current

    if (!currentVideo || !nextVideo) return

    // Start the next video from the beginning
    nextVideo.currentTime = 0
    nextVideo.play().catch(e => console.error(`Error playing video ${activeVideo === 1 ? 2 : 1}:`, e))

    // Very slow and smooth crossfade (2 seconds)
    let opacity = 0
    nextVideo.style.opacity = '0'

    // Start with a delay to ensure the next video has loaded its first frame
    setTimeout(() => {
      const fadeInterval = setInterval(() => {
        opacity += 0.01 // Very small increments for smoothness

        if (opacity >= 1) {
          clearInterval(fadeInterval)
          currentVideo.style.opacity = '0'
          nextVideo.style.opacity = '1'
          setActiveVideo(activeVideo === 1 ? 2 : 1)
          setIsTransitioning(false)
        } else {
          nextVideo.style.opacity = opacity.toString()
        }
      }, 20) // 20ms intervals (50 steps per second)
    }, 100)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video Background with Smooth Crossfade */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* First video */}
        <video
          ref={video1Ref}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-2000"
          muted
          playsInline
          src="/bg.mp4"
          style={{ opacity: activeVideo === 1 ? '1' : '0' }}
        />

        {/* Second video (identical but offset in timing) */}
        <video
          ref={video2Ref}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-2000"
          muted
          playsInline
          src="/bg.mp4"
          style={{ opacity: activeVideo === 2 ? '1' : '0' }}
        />

        {/* Gradient overlay to fade to black at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
        <div className="flex flex-col items-center mb-4">
          {/* Outlier logo */}
          {/* <div className="w-24 h-10 mb-1 relative">
            <motion.svg
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewBox="0 0 51 21.9"
              className="w-full h-full fill-white"
              aria-label="outlier"
            >
            </motion.svg>
          </div> */}
          {/* <span className="text-md text-gray-400 mb-2">
            <TextEffect per='word' preset='blur' speedReveal={1} className='mt-4' segmentWrapperClassName=''>
              presents
            </TextEffect>
          </span> */}
        </div>

        {/* Main Hero Text */}
        <h1 className="text-4xl md:text-6xl lg:text-8xl text-center text-white mb-6 max-w-4xl font-eb-garamond font-medium">
          <TextEffect per='word' preset='blur' speedReveal={1} className='mt-4' delay={0.4}>
            Welcome to Outlier AI hackathon
          </TextEffect>
        </h1>

        {/* Optional: Add description */}
        <span className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mb-8">
          <TextEffect per='word' preset='blur' speedReveal={1} delay={0.6}>
            Designed with love for developers and designers
          </TextEffect>
        </span>

        {/* Optional: CTA Button */}
        <Cta cta="Wanna Ghibli?" cols={22} rows={5}/>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-30 animate-float">
        <a href="#about" className="text-white/80 hover:text-white transition-colors">
          <ChevronDown size={36} />
        </a>
      </div>
      </div>
    </div>
  )
}

export default Hero
