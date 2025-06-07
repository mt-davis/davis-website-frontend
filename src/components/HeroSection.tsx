import Image from 'next/image';
import { FaConnectdevelop } from "react-icons/fa6";

export default function HeroSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8">
        {/* Left column: pathways list */}
        <div className="w-48 flex-shrink-0">
          <p className="text-lg font-bold mb-2">Pathways For:</p>
          <div className="flex flex-row items-start gap-8">
            <div>
              <h4 className="text-base font-medium">STRATEGY & INSIGHTS</h4>
              <h4 className="text-base font-medium">INNOVATION</h4>
              <h4 className="text-base font-medium">LEADERSHIP</h4>
            </div>
          </div>
        </div>

        {/* Center column: description */}
        <div className="prose flex-1 space-y-6">
          <p>For the last two decades, I've been at the intersection of IT excellence and visionary leadership, cultivating environments where innovation isn't just a buzzword, but a daily reality. I've not only witnessed the evolution of IT, I've been a driving force behind it.</p>
          
          <div className="w-full h-px bg-gray-200 my-4"></div>
          
          <p>I've been at the forefront of the IT industry, pioneering solutions that redefine what's possible. I've cultivated a philosophy where vision meets execution, leading high-caliber teams to break barriers and set new benchmarks.</p>
          <p>My journey has been more than just overseeing projects; it's been about inspiring change, embracing the relentless pace of technological advancement, and empowering organizations to not just adapt, but lead in a constantly evolving digital landscape.</p>
        </div>

        {/* Right column: profile image */}
        <div className="w-full md:w-80 flex-shrink-0 flex justify-center md:justify-start">
          <div className="relative w-64 md:w-80 aspect-square">
            <Image
              src="/images/profile-pic.png"
              alt="Marquese T Davis Profile"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}