import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import diaryAnimation from '../assets/diary-animation.mp4';

const InsightCard = ({ title, description }) => (
  <div className="bg-white/60 dark:bg-dark-wood/30 p-6 rounded-xl shadow-lg border border-gold/50 text-center transition-transform hover:scale-105">
    <h3 className="text-xl font-bold mb-2 text-wood dark:text-dark-gold">{title}</h3>
    <p className="text-ink/80 dark:text-dark-ink/80">{description}</p>
  </div>
);

function HomePage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-24">
      {/* --- Top Section --- */}
      <div className="grid md:grid-cols-2 gap-8 items-center mt-12">
        {/* Welcome Section */}
        <div className="text-left">
          <h2 className="text-5xl font-bold mb-4">
            {user ? <>Welcome back,<br />{user.name}</> : <>Welcome to The<br />Narrative Weaver</>}
          </h2>
          <p className="text-xl text-ink/80 dark:text-dark-ink/80 mb-8">
            {user
              ? "Ready to continue your narrative?"
              : "Your personal space for reflection and growth."}
          </p>
          <Link
            to={user ? "/diary" : "/register"}
            className="inline-block bg-wood dark:bg-dark-gold text-white dark:text-ink font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity text-lg"
          >
            {user ? "Write a New Entry" : "Get Started"}
          </Link>
        </div>

        {/* Video Section */}
        <div className="flex justify-center items-center">
          <div className="relative bg-white p-3 rounded-2xl shadow-lg border-4 border-dark-gold/60 hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out">
            <video
              src={diaryAnimation}
              className="w-full max-w-xs md:max-w-sm lg:max-w-md rounded-lg"
              autoPlay
              loop
              muted
              playsInline
            >
              Your browser does not support the video tag.
            </video>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md text-sm text-dark-gold font-semibold">
              Capturing Your Thoughts
            </div>
          </div>
        </div>
      </div>

      {/* --- Insights Section --- */}
      <div>
        <h2 className="text-4xl font-bold text-center mb-8">The Power of Journaling</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <InsightCard
            title="Reduce Stress"
            description="Writing about your thoughts and feelings can help manage anxiety, reduce stress, and cope with difficult emotions."
          />
          <InsightCard
            title="Improve Self-Awareness"
            description="Tracking your days makes it easier to spot patterns and triggers, building self-understanding over time."
          />
          <InsightCard
            title="Boost Memory"
            description="Putting experiences into words engages memory and strengthens recall."
          />
          <InsightCard
            title="Enhance Emotional Intelligence"
            description="Reflecting on emotions can improve empathy, clarity, and self-regulation."
          />
          <InsightCard
            title="Track Personal Growth"
            description="Looking back on past entries highlights progress and reveals areas to grow."
          />
          <InsightCard
            title="Ignite Creativity"
            description="A few lines a day keeps ideas flowing and sparks new connections."
          />
        </div>
      </div>

      {/* --- Divider --- */}
      <div className="relative">
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      </div>

      {/* --- History Section — Enhanced Narrative Timeline --- */}
      <section aria-labelledby="history-title" className="space-y-12">
        <h2 id="history-title" className="text-4xl font-bold text-center">
          A Brief History of Diary Writing
        </h2>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 bg-gold/50 h-full rounded"></div>

          {/* Ancient Beginnings */}
          <div className="mb-12 flex items-start w-full">
            <div className="w-1/2 pr-8 text-right">
              <h3 className="font-bold text-lg text-wood dark:text-dark-gold">
                Ancient Beginnings
              </h3>
              <p className="text-ink/80 dark:text-dark-ink/80">
                The earliest known precursor is the Egyptian <em>Diary of Merer</em> (~2570 BCE), which recorded logistics for pyramid building.  
                Later, Marcus Aurelius penned his philosophical thoughts in <em>Meditations</em>, a deeply introspective work.
              </p>
            </div>
            <div className="relative bg-gold w-4 h-4 rounded-full z-10" />
            <div className="w-1/2" />
          </div>

          {/* Medieval Reflections */}
          <div className="mb-12 flex items-start w-full flex-row-reverse">
            <div className="w-1/2 pl-8 text-left">
              <h3 className="font-bold text-lg text-wood dark:text-dark-gold">
                Medieval Reflections
              </h3>
              <p className="text-ink/80 dark:text-dark-ink/80">
                In the medieval Islamic world, an 11th-century diary by Abu Ali ibn al-Banna is one of the earliest dated personal logs.
                In Japan, court diaries like <em>pillowbooks</em> by Sei Shōnagon blended daily detail, poetry, and reflection.
              </p>
            </div>
            <div className="relative bg-gold w-4 h-4 rounded-full z-10" />
            <div className="w-1/2" />
          </div>

          {/* Early Modern Europe */}
          <div className="mb-12 flex items-start w-full">
            <div className="w-1/2 pr-8 text-right">
              <h3 className="font-bold text-lg text-wood dark:text-dark-gold">
                Renaissance & Early Modern Europe
              </h3>
              <p className="text-ink/80 dark:text-dark-ink/80">
                From the 14th century, examples like the <em>Journal d’un bourgeois de Paris</em> blended commentary and observation.
                Lady Margaret Hoby’s English diary (1599–1605) offers an intimate look at daily spiritual life.
              </p>
            </div>
            <div className="relative bg-gold w-4 h-4 rounded-full z-10" />
            <div className="w-1/2" />
          </div>

          {/* 17th Century */}
          <div className="mb-12 flex items-start w-full flex-row-reverse">
            <div className="w-1/2 pl-8 text-left">
              <h3 className="font-bold text-lg text-wood dark:text-dark-gold">
                17th Century: A Literary Leap
              </h3>
              <p className="text-ink/80 dark:text-dark-ink/80">
                Samuel Pepys’s diary (1660–1669) is one of history’s best-known personal accounts, documenting major events and social life with vivid clarity.
                Many diarists of the era drew inspiration—even across borders—to chronicle their worlds privately.
              </p>
            </div>
            <div className="relative bg-gold w-4 h-4 rounded-full z-10" />
            <div className="w-1/2" />
          </div>

          {/* 18th–19th Centuries */}
          <div className="mb-12 flex items-start w-full">
            <div className="w-1/2 pr-8 text-right">
              <h3 className="font-bold text-lg text-wood dark:text-dark-gold">
                18th–19th Centuries: Daily Reflection Becomes Common
              </h3>
              <p className="text-ink/80 dark:text-dark-ink/80">
                With greater literacy, diaries became a tool for reflection and self-discipline.
                In 1812, Letts of London revolutionized diary keeping with commercial pre-printed dated formats.
              </p>
            </div>
            <div className="relative bg-gold w-4 h-4 rounded-full z-10" />
            <div className="w-1/2" />
          </div>

          {/* 20th Century to Digital Age */}
          <div className="flex items-start w-full flex-row-reverse">
            <div className="w-1/2 pl-8 text-left">
              <h3 className="font-bold text-lg text-wood dark:text-dark-gold">
                20th Century to Digital Age
              </h3>
              <p className="text-ink/80 dark:text-dark-ink/80">
                Diaries such as Anne Frank’s wartime journal remain powerful personal narratives.
                In recent decades, blogs and secure journaling apps have carried forward the tradition in digital form—adding multimedia, prompts, and privacy.
              </p>
            </div>
            <div className="relative bg-gold w-4 h-4 rounded-full z-10" />
            <div className="w-1/2" />
          </div>
        </div>

        <p className="text-center text-sm text-ink/60 dark:text-dark-ink/60">
          A journey from ancient logs to modern digital diaries—rooted in the human desire to reflect, recall, and connect.
        </p>
      </section>
    </div>
  );
}

export default HomePage;
