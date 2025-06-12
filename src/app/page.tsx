'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from 'next/image';

const programs = [
  {
    title: 'Community Learning Circles',
    desc: 'We create informal, child-friendly spaces in underserved neighborhoods where children gather after school to learn, play, and grow together. These are safe environments where volunteers help with basic reading, writing, and understanding school subjects — always in the child\'s local language and context.'
  },
  {
    title: 'Pop-Up Learning Sessions',
    desc: 'In areas without consistent access to learning, we organize temporary sessions under trees, in courtyards, or wherever children naturally gather. Using mats, chalkboards, and storybooks, our teams turn everyday spaces into joyful, interactive classrooms — no buildings needed.'
  },
  {
    title: 'Support for Girl\'s Learning',
    desc: 'We work directly with families and communities to make sure young girls don\'t fall behind in school. We support their learning with reading groups, play sessions, hygiene kits, and open conversations — helping ensure they stay engaged and confident throughout their education journey.'
  },
  {
    title: 'Back-to-School Readiness',
    desc: 'For children who have dropped out or never been enrolled in formal schools, we offer bridge learning sessions. These help them catch up academically and emotionally so they can rejoin classrooms with confidence. Our volunteers also coordinate with local schools to make transitions smoother.'
  },
  {
    title: 'One-on-One Mentorship & Tutoring',
    desc: 'Volunteers work directly with children to build trust and curiosity. These one-on-one or small group sessions — often focused on reading, basic math, or just open-ended conversations — are designed to build self-esteem and academic comfort, especially for children who feel left out in large classrooms.'
  },
  {
    title: 'Access to Learning Tools',
    desc: 'We provide children with basic but powerful learning materials — notebooks, storybooks, coloring tools, rulers, maps — and show them how to use these in playful and educational ways. In some cases, we share recycled tablets preloaded with simple educational apps for offline exploration.'
  }
];


export default function Home() {
  const [galleryImage, setGalleryImage] = useState<string | null>(null);
  const [programsImage, setProgramsImage] = useState<string | null>(null);
  const [fullHeightImage, setFullHeightImage] = useState<string | null>(null);
  useEffect(() => {
    fetch('/api/gallery-list')
      .then(res => res.json())
      .then(data => {
        if (data.images && data.images.length > 0) {
          const random1 = Math.floor(Math.random() * data.images.length);
          let random2 = random1;
          let random3 = random1;

          if (data.images.length > 1) {
            while (random2 === random1) {
              random2 = Math.floor(Math.random() * data.images.length);
            }
          }
          if (data.images.length > 2) {
            while (random3 === random1 || random3 === random2) {
              random3 = Math.floor(Math.random() * data.images.length);
            }
          }
          setGalleryImage(data.images[random1]);
          setProgramsImage(data.images[random2]);
          setFullHeightImage(data.images[random3]);
        }
      });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative flex items-center h-screen text-white -mt-[72px]"
        style={{
          backgroundImage: "url('/images/hero/hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* 30% Opacity Black Overlay */}
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }}></div>
        {/* Content */}
        <div className="relative z-10 px-6 w-full flex flex-col items-start justify-center text-left max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Empowering Through Education
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-2xl drop-shadow">
            Join us in our mission to provide quality education to underprivileged children worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/donate"
              className="bg-white text-black px-8 py-3 text-lg font-semibold border-2 border-white transition-none text-center shadow-none rounded-lg"
            >
              Donate Now
            </Link>
            <Link
              href="/about"
              className="bg-transparent text-white px-8 py-3 text-lg font-semibold border-2 border-white hover:bg-white/5 transition-colors text-center shadow-none rounded-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Get Involved Section (improved alignment) */}
      <section className="w-full bg-white text-black py-16 border-b border-black flex flex-col">
        <div className="w-full flex flex-col items-center justify-center px-4 md:px-0">
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-medium mb-6 leading-tight font-serif text-center">Join Us in Changing Lives</h2>
            <p className="text-base md:text-lg mb-8 max-w-2xl text-gray-800 font-serif font-light text-center">
              Your support can light the path to education for countless children who need it the most. Whether you have time, resources, or expertise to share, there&apos;s a place for you in our mission.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-8">
              <div className="flex flex-col items-center text-center px-2">
                <h3 className="text-lg font-semibold mb-2 font-serif">Volunteer with Us</h3>
                <p className="text-gray-700 font-serif font-light">Help us teach, mentor, or organize community programs that empower young minds. Your time can make a world of difference.</p>
              </div>
              <div className="flex flex-col items-center text-center px-2">
                <h3 className="text-lg font-semibold mb-2 font-serif">Donate Today</h3>
                <p className="text-gray-700 font-serif font-light">Every contribution, big or small, helps us provide learning materials, build classrooms, and sustain vital education programs.</p>
              </div>
              <div className="flex flex-col items-center text-center px-2">
                <h3 className="text-lg font-semibold mb-2 font-serif">Partner with Us</h3>
                <p className="text-gray-700 font-serif font-light">If you represent an organization or business, join hands with us to create larger-scale impact through strategic collaborations.</p>
              </div>
            </div>
            <p className="text-base md:text-lg mb-8 max-w-2xl text-gray-800 font-serif font-light text-center">
              Together, we can build a future where education truly reaches every child.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl justify-center items-center">
              <Link href="/contact" className="w-full sm:flex-1 min-w-[180px] bg-black text-white px-6 py-3 text-base font-semibold border-2 border-black transition-colors shadow-none rounded-md text-center hover:bg-white hover:text-black">Become a Volunteer</Link>
              <Link href="/donate" className="w-full sm:flex-1 min-w-[180px] bg-white text-black px-6 py-3 text-base font-semibold border-2 border-black transition-colors shadow-none rounded-md text-center hover:bg-black hover:text-white">Donate Now</Link>
              <Link href="/contact" className="w-full sm:flex-1 min-w-[180px] bg-black text-white px-6 py-3 text-base font-semibold border-2 border-black transition-colors shadow-none rounded-md text-center hover:bg-white hover:text-black">Partner with Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full bg-white text-black py-0 border-b border-black flex flex-col">
        <div className="w-full flex flex-col md:flex-row items-stretch gap-0 px-0 min-h-[420px] md:h-[520px]">
          <div className="md:w-2/3 w-full flex flex-col items-start justify-center px-8 md:px-16 py-16 md:py-0">
            <h2 className="text-2xl md:text-3xl font-medium mb-6 leading-tight font-serif">Every Child Deserves a Chance to Learn</h2>
            <div className="text-base md:text-lg w-full text-gray-800 font-serif font-light space-y-4 overflow-y-auto pr-2" style={{ maxHeight: 400 }}>
              <p>In the heart of a rising India, where skyscrapers reach higher and digital revolutions redefine opportunity, there exists a stark contradiction — millions of children still wake up each morning without the certainty of going to school. Despite being home to the largest population of young people in the world, India continues to struggle with one of the most persistent and heartbreaking gaps: equitable access to quality education for all children.</p>
              <p>As of the 2021–22 Unified District Information System for Education (UDISE+), over 14 lakh schools operate across the country, yet nearly 2.9 million children aged 6 to 17 are still out of school, according to UNICEF and government estimates. The COVID-19 pandemic only worsened this crisis, pushing an additional 247 million students out of physical classrooms and exposing the severe digital divide. For children in rural and low-income urban communities, online education was not an alternative — it was an absence.</p>
              <p>India has made commendable progress over the decades. The literacy rate has risen to 77.7% (NSO, 2023), and school enrolment at the elementary level has consistently improved. The Right to Education Act, passed in 2009, mandates free and compulsory education for all children aged 6 to 14. And yet, access does not always equal learning. According to the ASER 2023 report, while 95% of children are enrolled in schools, nearly 50% of Class 5 students in rural India still cannot read a simple sentence in English or perform basic arithmetic. Quality of learning remains alarmingly low — and this is the heart of India&apos;s education crisis.</p>
              <p>Girls continue to face disproportionate challenges. Though enrolment has improved significantly, especially in government schools, dropout rates remain high after Class 8. Issues like early marriage, household responsibilities, menstrual health insecurity, and safety concerns keep many adolescent girls away from education. A 2022 study by CRY found that one in three girls from the most marginalized communities drops out of school by the age of 15.</p>
              <p>In many tribal and backward regions, classrooms are underfunded, teacher shortages are rampant, and infrastructure is inadequate. Thousands of schools lack basic necessities such as toilets, electricity, libraries, or clean drinking water — all critical for a healthy learning environment. According to UDISE+ data, over 15% of government schools do not have separate toilets for girls, directly affecting their attendance and retention.</p>
              <p>But beyond the statistics are stories — of bright minds held back by geography, poverty, and circumstance. Children like Rina, from a remote village in Jharkhand, who walks three kilometres daily to attend a one-room school without benches or books. Or Aman, a 10-year-old from a Delhi slum, who lost two years of education during the lockdown because his family didn&apos;t own a smartphone.</p>
              <p>This is where organizations like TheEducationForAll step in — to bridge the gap between policy and reality, between what is promised and what is delivered. Our work focuses not only on increasing enrolment but on ensuring meaningful learning. From setting up mobile classrooms in remote villages to training local teachers and creating safe, girl-friendly educational spaces, we believe in tackling the problem from the roots. Our approach is community-driven, child-focused, and impact-oriented.</p>
              <p>Education is not just a right — it is the foundation of all other rights. A child who learns is more likely to grow up healthy, avoid exploitation, participate in democratic life, and break the chains of generational poverty. An educated child becomes an empowered adult, and an empowered generation becomes a stronger, fairer, and more just nation.</p>
              <p>India cannot afford to leave any child behind in its quest for progress. The true measure of development is not GDP growth or urban expansion, but whether the most vulnerable among us can read, write, and dream. At TheEducationForAll, we&apos;re not just teaching children — we&apos;re building a future where every child has the freedom to choose their path. And we invite you to be a part of that future.</p>
            </div>
          </div>
          {galleryImage && (
            <div className="md:w-1/3 w-full relative flex justify-center items-stretch min-h-[320px] md:min-h-0 h-full">
              <Image
                src={galleryImage}
                alt="Gallery"
                width={800}
                height={600}
                className="absolute md:static inset-0 w-full h-full object-cover border border-black shadow-none rounded-none"
                style={{ minHeight: 220, height: '100%' }}
              />
            </div>
          )}
        </div>
      </section>

      {/* Our Programs Section */}
      <section className="w-full bg-white text-black py-0 border-b border-black relative">
        <div className="flex flex-col md:flex-row items-stretch min-h-[400px] w-full">
          {/* Left: Image (1/3) */}
          <div className="md:w-1/3 w-full h-[220px] md:h-auto flex-shrink-0">
            {programsImage && (
              <Image
                src={programsImage}
                alt="Programs Visual"
                width={800}
                height={600}
                className="w-full h-full object-cover border-r border-black shadow-none rounded-none"
                style={{ display: 'block' }}
              />
            )}
          </div>
          {/* Right: Content (2/3) */}
          <div className="md:w-2/3 w-full flex flex-col items-start justify-start p-0 m-0 bg-white">
            <div className="w-full px-4 md:px-10 pt-8 md:pt-12">
              <h2 className="text-3xl md:text-4xl mb-4 text-slate-900 text-left w-full font-serif">Our Programs</h2>
              <p className="text-lg md:text-xl mb-8 w-full text-left text-slate-900 font-serif">
                At TheEducationForAll, we believe that real change begins with equal access to quality education — no matter who you are or where you&apos;re born. Our programs are designed to address the root barriers that keep children out of classrooms and away from opportunities. From rural villages to urban slums, we are building bridges to brighter futures.
              </p>
              <div className="grid grid-cols-1 gap-0 w-full">
                {programs.map((prog, i) => (
                  <div key={i} className={`flex flex-col justify-start border-b border-slate-200 bg-white p-4 md:p-6 last:border-b-0`}> 
                    <div className="flex items-center mb-2">
                      <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-white text-lg font-bold mr-3">{i + 1}</div>
                      <h3 className="text-lg font-bold text-slate-900">{prog.title}</h3>
                    </div>
                    <p className="text-base md:text-lg w-full text-gray-800 font-serif font-light space-y-4 overflow-y-auto pr-2 leading-relaxed">{prog.desc}</p>
                  </div>
                ))}
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </section>

      {/* 100vh Image Section */}
      <section
        className="w-full h-screen relative"
        style={{
          backgroundImage: `url(${fullHeightImage || '/images/hero/hero.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Optional: Add an overlay for better text readability if you put text on it */}
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-white text-4xl font-bold">
          {/* Optional: Add text over the image here */}
        </div>
      </section>
    </div>
  );
}
