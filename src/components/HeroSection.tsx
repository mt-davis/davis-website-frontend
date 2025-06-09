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
          <p className="text-lg text-gray-600 mb-8">
            I&apos;m a seasoned technology leader with over 20 years of experience. I&apos;ve led teams at Fortune 500 companies, startups, and everything in between. Today, I&apos;m focused on helping organizations build high-performing teams and deliver exceptional results. Let&apos;s work together to unlock your team&apos;s full potential.
          </p>
          <p className="text-lg text-gray-600 mb-8">
            I&apos;m passionate about helping leaders and organizations thrive in today&apos;s rapidly evolving business landscape. Whether you&apos;re scaling your team, navigating a transformation, or seeking to enhance your leadership capabilities, I&apos;m here to help.
          </p>
          
          <div className="text-lg text-gray-600 mb-8"></div>
          <p className="text-lg text-gray-600 mb-8">
           I've been at the forefront of the IT industry, pioneering solutions that redefine what's possible. I've cultivated a philosophy where vision meets execution, leading high-caliber teams to break barriers and set new benchmarks.</p>
          <p className="text-lg text-gray-600 mb-8">
            My journey has been more than just overseeing projects; it's been about inspiring change, embracing the relentless pace of technological advancement, and empowering organizations to not just adapt, but lead in a constantly evolving digital landscape.</p>
        </div>

        {/* Right column: profile image */}
        <div className="w-full md:w-auto flex-shrink-0 flex justify-center">
          <div className="relative">
            <Image
              src="/images/profile-pic.png"
              alt="Marquese T Davis Profile"
              width={250}  // Mobile size
              height={250} // Mobile size
              className="object-cover rounded-lg md:w-[350px] md:h-[350px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}