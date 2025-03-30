"use client"

import type React from "react"
import { useRef, useMemo, useCallback, useEffect } from "react"
import { useMotionValue, animate } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface CtaProps extends Omit<React.ComponentPropsWithoutRef<typeof Button>, "children"> {
  cols?: number
  rows?: number
  cta: string
}

export function Cta({ cols = 34, rows = 8, className, cta, ...props }: CtaProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLButtonElement>(null)
  const mousePosition = useRef({ x: 0, y: 0 })

  const cells = useMemo(() => {
    const maxDimension = Math.max(cols, rows)
    // Add an extra column and row to ensure coverage
    return Array.from({ length: (cols + 1) * (rows + 1) }, (_, index) => ({
      x: index % (cols + 1),
      y: Math.floor(index / (cols + 1)),
      nx: (index % (cols + 1)) / maxDimension,
      ny: Math.floor(index / (cols + 1)) / maxDimension,
      value: 0,
      shift: Math.random(),
    }))
  }, [cols, rows])

  const aspect = useMemo(() => cols / rows, [cols, rows])
  const intensity = useMotionValue(0)

  const getShadow = useCallback(() => {
    if (!containerRef.current) return ""
    const shadows = []
    // Adjust cell size calculation to account for full width
    const cellWidth = (containerRef.current.offsetWidth + 2) / cols
    const cellHeight = (containerRef.current.offsetHeight + 2) / rows
    const radius = 2 * intensity.get() * 1.3

    const clamp = (number: number, lower: number, upper: number) =>
      Math.min(Math.max(number, lower), upper)

    for (const cell of cells) {
      // Adjust x and y calculations
      const x = `${cell.x * cellWidth}px`
      const y = `${cell.y * cellHeight}px`
      const distance = Math.sqrt(
        Math.pow(cell.nx - mousePosition.current.x, 2) +
        Math.pow(cell.ny - mousePosition.current.y, 2)
      )
      const cellIntensity = clamp(radius - distance - 0.3 * cell.shift, 0, 1)
      const color = cellIntensity < 0.5 ? "#000000" :
        cellIntensity > 0.75 ? "#000000" : "#ffffff"
      shadows.push(`${x} ${y} ${color}`)
    }

    return shadows.join(", ")
  }, [intensity, cells, cols, rows])

  const updateShadow = useCallback(() => {
    if (gridRef.current) {
      gridRef.current.style.boxShadow = getShadow()
    }
  }, [getShadow])

  useEffect(() => {
    const intervalId = setInterval(updateShadow, 1000 / 30)
    return () => clearInterval(intervalId)
  }, [updateShadow])

  const handleMouseLeave = useCallback(() => {
    animate(intensity, 0, {
      duration: 1,
      onUpdate: updateShadow,
    })
  }, [intensity, updateShadow])

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mousePosition.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height / aspect,
      }

      intensity.set(Math.max(intensity.get(), 0.3))
      animate(intensity, 1, {
        duration: 1.8,
        onUpdate: updateShadow,
      })
    },
    [aspect, intensity, updateShadow],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mousePosition.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height / aspect,
      }
    },
    [aspect],
  )

  return (
    <Button
      size="lg"
      variant="cta"
      className={cn(
        " relative overflow-hidden whitespace-nowrap ",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={containerRef}
      style={{
        aspectRatio: aspect,
        ...props.style,
      }}
      {...props}
    >
      <div
        className={cn(
          "absolute top-0 left-0 -translate-x-full aspect-square text-black",
          "w-[calc(100%/var(--cta-cols)+2px)]",
          "motion-reduce:invisible"
        )}
        ref={gridRef}
        style={{ "--cta-cols": cols } as React.CSSProperties}
        aria-hidden="true"
      />
      <span className=" z-10 w-full">{cta}</span>
    </Button>
  )
}
