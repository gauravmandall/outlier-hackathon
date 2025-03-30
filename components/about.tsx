"use client"

import Image from 'next/image'

type OrganizerType = {
    name: string
    role: string
    image: string
}

const About = () => {
    // Sample organizers data - replace with actual data
    const organizers: OrganizerType[] = [
        {
            name: "Ishan Sharma",
            role: "Youtuber | Markitup",
            image: "/images/judges/ishan.jpg"
        },
        {
            name: "Outlier",
            role: "Organiser | Sponsor",
            image: "/images/judges/outlier.jpg"
        },
        // {
        //     name: "Gaurav Mandal",
        //     role: "Participant",
        //     image: "/images/judges/gaurav.png"
        // },
    ]

    return (
        <section id='about' className="text-white mb-24">
            {/* No need for container, borders or padding as they're handled by SectionWrapper */}
            {/* Section Title */}
            <h2 className="text-3xl md:text-4xl font-eb-garamond mb-16 text-center">Frontend UI Hackathon 2025</h2>

            {/* Description Section */}
            <div className="mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <p className="text-lg text-gray-300">
                            Join us for the Outlier's frontend UI hackathon, where innovators, creators, and problem-solvers
                            from around the globe come together to build the next generation of technology.
                        </p>
                        {/* <p className="text-lg text-gray-300">
                            It is not only hackathon, participants will get insane job opportunities. Whether you're a
                            seasoned developer or just starting your coding journey, this hackathon offers
                            an inclusive environment for all skill levels.
                        </p> */}
                    </div>
                    <div className="space-y-4">
                        {/* <p className="text-lg text-gray-300">
                            With mentorship from industry experts, workshops to enhance your skills, and
                            networking opportunities with like-minded individuals, this event is designed
                            to inspire creativity and foster innovation.
                        </p> */}
                        <p className="text-lg text-gray-300">
                            Substantial prizes await the most innovative projects, with categories ranging
                            from AI and machine learning to sustainability and social impact. Don't miss
                            this chance to showcase your talents and make a difference!
                        </p>
                    </div>
                </div>
            </div>

            {/* Horizontal divider */}
            <div className="my-16">
                <div className="relative h-2 w-full bg-black">
                    <hr className="absolute top-1/2 inset-x-0 border-t border-white/10" />
                </div>
            </div>

            {/* Prizes Section */}
            <div className="mb-20">
                <h4 className="text-xl md:text-2xl font-eb-garamond text-center mb-6">Prizes</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-lg">
                    <div className="bg-black p-6 rounded-lg border border-white/10">
                        <h5 className="text-lg font-bold mb-3 text-white">1st Place</h5>
                        <p className="text-gray-300">M4 MacBook Pro</p>
                    </div>
                    <div className="bg-black p-6 rounded-lg border border-white/10">
                        <h5 className="text-lg font-bold mb-3 text-white">2nd Place</h5>
                        <p className="text-gray-300">PlayStation 5</p>
                    </div>
                    <div className="bg-black p-6 rounded-lg border border-white/10">
                        <h5 className="text-lg font-bold mb-3 text-white">3rd Place</h5>
                        <p className="text-gray-300">Ray-Ban Meta Glasses</p>
                    </div>
                </div>
                <p className="text-lg text-gray-300 text-center mt-4">
                    *Freelance work opportunities for the top 1% as well! 🎉
                </p>
            </div>

            {/* Horizontal divider */}
            <div className="my-16">
                <div className="relative h-2 w-full bg-black">
                    <hr className="absolute top-1/2 inset-x-0 border-t border-white/10" />
                </div>
            </div>

            {/* Submission Section */}
            <div className="mb-20">
                <h4 className="text-xl md:text-2xl font-eb-garamond text-center mb-6">Important Dates</h4>
                <div className="p-8 rounded-lg">
                    <p className="text-lg text-gray-300 text-center">
                        Submission Deadline: Sunday, March 30th 11:59 PM PT
                    </p>
                    <p className="text-lg text-gray-300 text-center mt-4">
                        Winners Announced: After April 3rd
                    </p>
                </div>
            </div>

            {/* Horizontal divider */}
            <div className="my-16">
                <div className="relative h-2 w-full bg-black">
                    <hr className="absolute top-1/2 inset-x-0 border-t border-white/10" />
                </div>
            </div>

            {/* Submission Requirements Section */}
            <div className="mb-20">
                <h4 className="text-xl md:text-2xl font-eb-garamond text-center mb-6">Submission Requirements</h4>
                <div className="p-8 rounded-lg">
                    <p className="text-lg text-gray-300 text-center">
                        Submit up to 5 submissions (must use a different prompt for each)
                    </p>
                    <p className="text-lg text-gray-300 text-center mt-4">
                        Your submission must include both the visual design AND working implementation
                    </p>
                    <p className="text-lg text-gray-300 text-center mt-4">
                        Submit via the official form:{" "}
                        <a href="https://form.typeform.com/to/Hljx9wab" className="text-blue-400 hover:text-blue-300">
                            submit now
                        </a>
                    </p>
                </div>
            </div>

            {/* Horizontal divider */}
            <div className="my-16">
                <div className="relative h-2 w-full bg-black">
                    <hr className="absolute top-1/2 inset-x-0 border-t border-white/10" />
                </div>
            </div>

            {/* Organizers Section */}
            <div>
                <h4 className="text-xl md:text-2xl font-eb-garamond text-center mb-6">Organizers</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {organizers.map((organizer) => (
                        <div key={`${organizer.name}-${organizer.role}`} className="bg-black p-6 rounded-lg  text-center transition-transform ">
                            <div className="relative w-32 h-32 mx-auto mb-4 rounded-md overflow-hidden opacity-80 hover:opacity-100">
                                <Image
                                    src={organizer.image}
                                    alt={organizer.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h4 className="text-xl font-bold">{organizer.name}</h4>
                            <p className="text-gray-400">{organizer.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default About