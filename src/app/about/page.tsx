'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AboutPage: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/gallery-list')
      .then(res => res.json())
      .then(data => {
        if (data.images && data.images.length > 0) {
          const shuffled = [...data.images].sort(() => 0.5 - Math.random());
          setGalleryImages(shuffled.slice(0, 3)); // Fetching up to 3 images for the page
        }
      });
  }, []);

  return (
    <div className="w-full bg-white text-black font-serif">
      <div className="w-full px-8 md:px-16 lg:px-24 py-8">
        <h1 className="text-3xl md:text-6xl font-bold mb-6 font-serif border-b-2 border-black pb-4">
          About Us
        </h1>

        {/* Main Lead Section with Drop Cap and Image */}
        <section className="mb-12 border-b-2 border-black pb-16 grid grid-cols-1 md:grid-cols-5 gap-8 items-stretch">
          <div className="md:col-span-3 flex flex-col">
            <h2 className="text-2xl md:text-3xl font-medium mb-6 leading-tight font-serif">
              A Grassroots Movement Built on Love, Learning, and Laughter
            </h2>
            <div className="text-base md:text-lg text-gray-800 font-light space-y-4 text-justify">
              <p>
                <span className="float-left text-7xl font-bold mr-4 leading-none">T</span>
                heEducationForAll is a small, community-based non-governmental organization (NGO) that exists for one simple reason: to help children grow into confident, curious, and healthy individuals &mdash; no matter where they come from or what they can afford. We operate on the unwavering belief that every child, irrespective of their background or economic status, deserves the opportunity to learn, explore, and flourish. Our commitment is to nurture curiosity, build confidence, and ensure that every young mind has the resources and support needed to thrive.
              </p>
              <div className="font-bold text-gray-900 space-y-2 mb-4">
                <p>We don&apos;t run a school.</p>
                <p>We don&apos;t offer coaching.</p>
                <p>We don&apos;t charge fees.</p>
              </div>
              <p>
                What we do is this: We dedicate our time to children who are often overlooked and under-resourced, providing them with the care, attention, and encouragement they desperately need. Our efforts go beyond mere academics; we help them understand their school subjects, teach them how to read and write proficiently, and &mdash; even more importantly &mdash; we facilitate their holistic development by encouraging them to play, move, express themselves creatively, and truly enjoy the irreplaceable joys of childhood. We believe in fostering an environment where learning is a natural, joyous process, not a burden.
              </p>
              <p>
                We believe that education is not just what happens within the four walls of a classroom. It&apos;s a continuous, dynamic process that unfolds when a child feels genuinely heard and understood. It&apos;s what happens when they are empowered to ask questions without fear of judgment, when they run freely and engage in imaginative games, and when someone patiently helps them decipher a complex sentence in their textbook or enthusiastically cheers for them as they kick a ball. It&apos;s about nurturing their innate curiosity and providing them with the tools to navigate the world.
              </p>
              <p className="font-medium">
                That&apos;s the kind of learning we ardently support and strive to make accessible to all.
              </p>
            </div>
          </div>
          <div className="md:col-span-2 pb-8 md:pb-0">
            {galleryImages[0] && (
              <div className="relative w-full h-full min-h-[250px] md:min-h-0">
                <Image
                  src={galleryImages[0]}
                  alt="A moment of shared learning and joy, reflecting our commitment to accessible education for every child."
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <p className="text-sm italic text-gray-600 mt-6 pb-8 md:pb-0">
              A moment of shared learning and joy, reflecting our commitment to accessible education for every child.
            </p>
          </div>
        </section>

        {/* Two Column Section for "How We Began" and "What We Do" */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <section className="border-b-2 border-black pb-8 md:border-r-2 md:pr-8">
            <h2 className="text-2xl md:text-3xl font-medium mb-6 leading-tight font-serif">
              How We Began: A Grassroots Movement
            </h2>
            <div className="text-base md:text-lg text-gray-800 font-light space-y-4 text-justify">
              <p>
                TheEducationForAll was not conceived in a sterile boardroom or through a formal strategy meeting. It was born organically from the acute observations and deep empathy of a small, dedicated group of young adults, students, and teachers. They witnessed firsthand that numerous children in their communities were inadvertently falling behind &ndash; not due to a lack of inherent intelligence or capability, but simply because there was no one with the time, resources, or specific attention to help them catch up and keep pace.
              </p>
              <h3 className="text-lg font-bold mt-6 mb-2">Specifically, they observed children who were:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Struggling profoundly to read or write, even after several years of formal schooling, indicating significant gaps in foundational literacy.</li>
                <li>Missing out on crucial playtime and opportunities for physical development because their parents were either too busy with work or laboring long hours to make ends meet.</li>
                <li>Growing up in environments where there was no consistent adult presence to answer their myriad questions, nurture their budding interests, or provide basic emotional and intellectual support.</li>
                <li>Unfairly pushed aside, labeled as &quot;slow,&quot; &quot;poor,&quot; or marginalized simply for being &quot;from that basti&quot; (slum or underserved community), leading to social and academic isolation.</li>
              </ul>
            </div>
          </section>

          <section className="pb-8">
            <h2 className="text-2xl md:text-3xl font-medium mb-6 leading-tight font-serif">
              What We Do (And Why We Do It): Filling the Gaps
            </h2>
            <div className="text-base md:text-lg text-gray-800 font-light space-y-4 text-justify">
              <p>
                We want to be clear: TheEducationForAll is not attempting to compete with established coaching centers or replace the vital role of professional teachers. Our purpose is distinctly different. We exist to precisely fill the critical gaps where children are being left behind &ndash; not just academically, but also emotionally, physically, and socially. Our approach is complementary, designed to bolster their overall development and ensure no child slips through the cracks.
              </p>
              <h3 className="text-lg font-bold mt-6 mb-2">1. Basic Learning Support: Building Foundational Skills</h3>
              <p>
                Our core academic program focuses on empowering children from Classes 1&ndash;8 with essential foundational skills. We dedicate significant time to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-bold">Reading and writing proficiency:</span> In both Hindi and English, enabling them to comprehend textbooks and communicate effectively.</li>
                <li><span className="font-bold">Understanding simple Mathematics:</span> Covering fundamental concepts like addition, subtraction, multiplication, and division, building a strong numerical base.</li>
                <li><span className="font-bold">Learning basic science and environment concepts:</span> Fostering an early understanding of the natural world and scientific inquiry.</li>
                <li><span className="font-bold">Exploring art, stories, rhymes, and general awareness:</span> Encouraging creativity, imagination, and a broad understanding of the world around them.</li>
              </ul>
              <p>
                Many of the children we work with are the first in their families to attend school, or come from educational backgrounds where basic literacy was not prioritized. They often need a little extra time and personalized care to catch up with the curriculum being taught in their formal classes, and we are committed to providing that patient, dedicated support.
              </p>
            </div>
          </section>
        </div>

        {/* New Sections: Emotional and Social Learning & Play, Movement & Expression with images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <section className="border-b-2 border-black pb-8 md:border-r-2 md:pr-8">
            <h2 className="text-2xl md:text-3xl font-medium mb-6 leading-tight font-serif">
              2. Emotional and Social Learning: Because Feelings Matter
            </h2>
            <div className="text-base md:text-lg text-gray-800 font-light space-y-4 text-justify">
              <p>
                For many of our children, school is a space of shame and silence &mdash; they&apos;re mocked for not understanding lessons, or ignored because they&apos;re &quot;slow.&quot; We aim to reverse that. At TheEducationForAll, every child is treated with respect. We listen when they talk. We help them articulate their feelings. We cheer their small victories and comfort them through tough days.
              </p>
              <p>
                Our volunteers are trained to watch for signs of emotional distress, bullying, neglect, or lack of self-esteem. Often, our greatest contribution isn&apos;t teaching the alphabet &mdash; it&apos;s teaching children that they matter. When a child who used to sit in the corner starts raising their hand, smiling, and helping others &mdash; that&apos;s when we know we&apos;re succeeding.
              </p>
              <p>
                We also teach interpersonal skills: teamwork, empathy, sharing, and leadership. Group games, art sessions, and storytelling circles become spaces for emotional growth. A child who learns to wait their turn in a game or comfort a friend who lost a race is also learning how to be a kind, responsible citizen. These are lessons they carry for life.
              </p>
            </div>
          </section>

          <section className="pb-8">
            <h2 className="text-2xl md:text-3xl font-medium mb-6 leading-tight font-serif">
              3. Play, Movement & Expression: Learning Beyond Books
            </h2>
            <div className="text-base md:text-lg text-gray-800 font-light space-y-4 text-justify">
              <p>
                Education is more than textbooks. That&apos;s why a large part of our work revolves around physical education, play, and creative expression. We believe in the healing power of movement &mdash; running, jumping, dancing, laughing. Children need to move to grow. Sadly, many don&apos;t get that opportunity, either due to lack of space or overburdened home lives.
              </p>
              <p>
                We organize weekly games, races, yoga sessions, and free play. It&apos;s not about competition &mdash; it&apos;s about freedom. When a child races without worrying about coming last, they learn courage. When they pass the ball to a teammate, they learn cooperation. When they play together, they build trust and community.
              </p>
              <p>
                Art and music are equally important. Drawing sessions, storytelling hours, group songs &mdash; these foster imagination and help children process emotions. A drawing of a tree may seem simple, but for a child who&apos;s never been asked to express themselves, it&apos;s a breakthrough. In these moments, learning becomes play. And play becomes therapy.
              </p>
            </div>
          </section>
        </div>

        {/* Additional images, if needed for the layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="md:col-span-1">
            {galleryImages[1] && (
              <div className="relative w-full aspect-square">
                <Image
                  src={galleryImages[1]}
                  alt="Children engaged in learning"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <p className="text-sm italic text-gray-600 mt-2 text-justify">
              Learning and growing together.
            </p>
          </div>
          <div className="md:col-span-1">
            {galleryImages[2] && (
              <div className="relative w-full aspect-square">
                <Image
                  src={galleryImages[2]}
                  alt="Children playing outdoors"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <p className="text-sm italic text-gray-600 mt-2 text-justify">
              Joyful moments in the community.
            </p>
          </div>
        </div>

        {/* Final Section: Looking Ahead */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-medium mb-6 leading-tight font-serif">
            Looking Ahead: Our Vision for Tomorrow
          </h2>
          <div className="text-base md:text-lg text-gray-800 font-light space-y-4 text-justify">
            <p>
              Our dream is simple yet bold: We want every child to feel valued, to be given a fair chance, and to grow up believing in their potential. We envision communities where children are nurtured not just by formal education, but by human connection. Where children in slums or villages have just as much access to joy, imagination, and mentorship as those in elite schools.
            </p>
            <p>
              We are currently expanding to more urban slum clusters, government school neighborhoods, and migrant worker communities. As our volunteer base grows, so does our reach. But scale is not our goal &mdash; impact is. Even if we can change one child&apos;s life each week, we believe that&apos;s enough to justify our efforts.
            </p>
            <p>
              Ultimately, we want to be invisible bridges &mdash; the kind of support children never have to ask for, but always find when they need it. We want our work to inspire others to start their own grassroots education efforts. We want to live in a country where &quot;helping children learn&quot; is not seen as charity &mdash; but as community duty.
            </p>
          </div>
        </section>

        {/* Volunteer With Us Section */}
        <section className="w-full bg-white text-black py-16 border-b-2 border-black flex flex-col items-center justify-center text-center px-4 md:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-medium mb-6 leading-tight font-serif">
              Volunteer With Us &mdash; Be the Change
            </h2>
            <p className="text-base md:text-lg mb-8 max-w-2xl text-gray-800 font-serif font-light">
              Our volunteers are the heart of our mission. Every hour you dedicate, every lesson you share, every smile you bring &mdash; it all transforms lives. Join our passionate community and help us build a brighter future for children in need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mx-auto items-center sm:w-auto">
              <Link
                href="/contact"
                className="w-full sm:w-auto min-w-[180px] bg-black text-white px-6 py-3 text-base font-semibold border-2 border-black transition-colors shadow-none rounded-md text-center hover:bg-white hover:text-black whitespace-nowrap"
              >
                Become a Volunteer
              </Link>
              <Link
                href="/donate"
                className="w-full sm:w-auto min-w-[180px] bg-white text-black px-6 py-3 text-base font-semibold border-2 border-black transition-colors shadow-none rounded-md text-center hover:bg-black hover:text-white whitespace-nowrap"
              >
                Donate Now
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto min-w-[180px] bg-black text-white px-6 py-3 text-base font-semibold border-2 border-black transition-colors shadow-none rounded-md text-center hover:bg-white hover:text-black whitespace-nowrap"
              >
                Partner with Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;