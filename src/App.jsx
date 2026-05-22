import { AnimatePresence, motion } from "framer-motion"
import sitaKalyanam from "./assets/Sita Kalyanam-128kbps.mp3"
import { useEffect, useMemo, useRef, useState } from "react"

import { useAnimationSystem } from "./animations"

import BackgroundHearts from "./components/BackgroundHearts"
import CountdownSection from "./components/CountdownSection"
import DressCodeSection from "./components/DressCodeSection"
import EventsSection from "./components/EventsSection"
import FloatingNav from "./components/FloatingNav"
import FooterSection from "./components/FooterSection"
import CelebrationsVibeSection from "./components/CelebrationsVibeSection"
import GallerySection from "./components/GallerySection"
import HeroSection from "./components/HeroSection"
import Loader from "./components/Loader"
import RSVPSection from "./components/RSVPSection"
import StorySection from "./components/StorySection"
import VenueSection from "./components/VenueSection"
import WelcomeSection from "./components/WelcomeSection"

import {
  dressDetails,
  events,
  galleryImages,
  storyMoments,
  weddingInfo,
} from "./data/weddingContent"

const MotionMain = motion.main

const trackUrls = [sitaKalyanam]

function App() {
  const animations = useAnimationSystem()

  const [isLoading, setIsLoading] = useState(true)

  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false

    const savedTheme = window.localStorage.getItem("theme")

    if (savedTheme) {
      return savedTheme === "dark"
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  const [isPlaying, setIsPlaying] = useState(true)

  const audioRef = useRef(null)

  const createAudio = (url) => {
    const audio = new Audio(url)

    audio.loop = true
    audio.preload = "auto"
    audio.volume = 0.35
    audio.currentTime = 45

    return audio
  }

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)

    window.localStorage.setItem(
      "theme",
      isDark ? "dark" : "light"
    )
  }, [isDark])

  // Auto play music
  useEffect(() => {
    if (isPlaying && !audioRef.current) {
      onMusicToggle()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cleanup audio
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [])

  const onThemeToggle = () => {
    setIsDark((prev) => !prev)
  }

  const onMusicToggle = async () => {
    if (!audioRef.current) {
      audioRef.current = createAudio(trackUrls[0])
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }

    for (const url of trackUrls) {
      try {
        if (audioRef.current.src !== url) {
          audioRef.current.pause()
          audioRef.current = createAudio(url)
        }

        await audioRef.current.play()

        setIsPlaying(true)

        return
      } catch {
        // fallback
      }
    }

    setIsPlaying(false)
  }

  const bride = useMemo(
    () => weddingInfo.couple.bride,
    []
  )

  const groom = useMemo(
    () => weddingInfo.couple.groom,
    []
  )

  return (
    <>
      <AnimatePresence>
        {isLoading ? (
          <Loader
            bride={bride}
            groom={groom}
            isDark={isDark}
            onFinish={() => setIsLoading(false)}
          />
        ) : (
          <div
            className="
              relative isolate overflow-x-hidden min-h-screen

              bg-gradient-to-br
              from-[#fff7f5]
              via-[#fde8e4]
              to-[#f7d2cb]

              dark:from-[#140d12]
              dark:via-[#241520]
              dark:to-[#3a2231]

              transition-all duration-700
            "
          >
            {/* Background Hearts */}
            <BackgroundHearts />

            {/* Left Glow */}
            <span
              className="
                absolute
                left-[-120px]
                top-[120px]

                h-[320px]
                w-[320px]

                rounded-full
                blur-3xl

                bg-[#f8cfc7]/40
                dark:bg-[#b06a8d]/20
              "
              aria-hidden="true"
            />

            {/* Right Glow */}
            <span
              className="
                absolute
                right-[-100px]
                bottom-[120px]

                h-[280px]
                w-[280px]

                rounded-full
                blur-3xl

                bg-[#f5b8aa]/30
                dark:bg-[#7b3f61]/20
              "
              aria-hidden="true"
            />

            {/* Floating Navigation */}
            <FloatingNav
              isDark={isDark}
              onThemeToggle={onThemeToggle}
              isPlaying={isPlaying}
              onMusicToggle={onMusicToggle}
            />

            {/* Main Content */}
            <MotionMain
              className="
                relative z-10

                pt-12 md:pt-12

                text-[#4b2e2e]
                dark:text-[#f8e8ec]
              "
              variants={animations.pageTransition}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <HeroSection
                bride={bride}
                groom={groom}
                dateLabel={weddingInfo.dateLabel}
                locationLabel={weddingInfo.locationLabel}
                heading="Where Love Becomes Forever"
              />

              <WelcomeSection
                bride={bride}
                groom={groom}
                locationLabel={weddingInfo.locationLabel}
              />

              <CountdownSection
                targetDate={weddingInfo.targetDate}
              />

              <StorySection moments={storyMoments} />

              <EventsSection events={events} />

              <GallerySection
                images={galleryImages}
                bride={bride}
                groom={groom}
              />

              <CelebrationsVibeSection
                images={galleryImages}
                bride={bride}
                groom={groom}
              />

              <RSVPSection />

              <VenueSection
                venues={weddingInfo.venues}
              />

              <DressCodeSection
                details={dressDetails}
              />
            </MotionMain>

            {/* Footer */}
            <FooterSection
              contact={weddingInfo.contact}
              bride={bride}
              groom={groom}
            />
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App