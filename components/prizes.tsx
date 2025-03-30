"use client"

import Image from 'next/image'

type PrizeType = {
  title: string
  amount: string
  description: string
  icon: string
}

const Prizes = () => {
  // Grand Prize (Top Tier)
  const grandPrize: PrizeType = {
    title: "Grand Prize",
    amount: "$500,000",
    description: "Awarded to the team with the most innovative and impactful project that aligns with our hackathon theme.",
    icon: "/prizes/grand-prize.png"
  }

  // Second Tier Prizes
  const secondTierPrizes: PrizeType[] = [
    {
      title: "Runner Up",
      amount: "$250,000",
      description: "For the second-place team that demonstrates exceptional technical execution and creativity.",
      icon: "/prizes/runner.png"
    },
    {
      title: "Category Winners",
      amount: "$100,000 each",
      description: "Five category prizes for the best projects in AI, Sustainability, Web3, Health Tech, and Social Impact.",
      icon: "/prizes/category.png"
    }
  ]

  // Third Tier Prizes
  const thirdTierPrizes: PrizeType[] = [
    {
      title: "Community Choice",
      amount: "$75,000",
      description: "Voted by hackathon participants and the wider tech community for the most beloved project.",
      icon: "/prizes/community.png"
    },
    {
      title: "Best Technical Implementation",
      amount: "$50,000",
      description: "For the team that demonstrates the most impressive technical skills and innovation.",
      icon: "/prizes/technical.png"
    },
    {
      title: "Best UI/UX Design",
      amount: "$50,000",
      description: "Awarded to the project with the most intuitive, accessible, and visually appealing interface.",
      icon: "/prizes/ui:ux.png"
    }
  ]

  // Calculate total prize pool
  const totalPrizePool = "$1,000,000+"

  return (
    <section className="text-white">
      {/* Section Title with Prize Pool */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-eb-garamond mb-8">Prizes</h2>
        <div className="inline-block bg-black border border-white/20 rounded-lg px-8 py-3">
          <p className="text-xl md:text-2xl font-bold">Total Prize Pool: <span className="text-white">{totalPrizePool}</span></p>
        </div>
      </div>

      {/* Tree-like Prize Structure */}
      <div className="space-y-12 max-w-5xl mx-auto">
        {/* First Tier - Grand Prize */}
        <div className="flex flex-col items-center gap-8 bg-black border border-white/10 rounded-lg p-8 mx-auto">
          <div className="w-32 h-32 relative">
            <Image
              src={grandPrize.icon}
              alt={grandPrize.title}
              fill
              className="object-contain"
            />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">{grandPrize.title}</h3>
            <p className="text-3xl font-eb-garamond text-white mb-4">{grandPrize.amount}</p>
            <p className="text-gray-400">{grandPrize.description}</p>
          </div>
        </div>

        {/* Connecting Line */}
        <div className="relative h-12 w-1 mx-auto">
          <div className="absolute inset-0 border-l border-dashed border-white/10" />
        </div>

        {/* Second Tier - Runner Up & Category Winners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
          {secondTierPrizes.map((prize) => (
            <div
              key={prize.title}
              className="bg-black border border-white/10 rounded-lg overflow-hidden flex"
            >
              <div className="w-24 bg-black/30 flex items-center justify-center">
                <div className="relative w-24 h-24 my-4">
                  <Image
                    src={prize.icon}
                    alt={prize.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{prize.title}</h3>
                <p className="text-2xl font-eb-garamond text-white mb-2">{prize.amount}</p>
                <p className="text-gray-400 text-sm">{prize.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Connecting Line */}
        <div className="relative h-12 w-1 mx-auto">
          <div className="absolute inset-0 border-l border-dashed border-white/10" />
        </div>

        {/* Third Tier - Other Prizes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto">
          {thirdTierPrizes.map((prize) => (
            <div
              key={prize.title}
              className="bg-black border border-white/10 rounded-lg p-4 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 relative mb-3">
                <Image
                  src={prize.icon}
                  alt={prize.title}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-bold mb-1">{prize.title}</h3>
              <p className="text-xl font-eb-garamond text-white mb-2">{prize.amount}</p>
              <p className="text-gray-400 text-xs">{prize.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Prizes
