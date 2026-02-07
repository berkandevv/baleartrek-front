export default function TrekDetailsAbout({ aboutParagraphs, trekId }) {
  const lastIndex = aboutParagraphs.length - 1
  return (
    <div className="bg-white dark:bg-[#1a2c30] rounded-xl p-6 md:p-8 border border-[#dbe4e6] dark:border-[#2a3c40]">
      <h2 className="text-2xl font-bold mb-4 text-[#111718] dark:text-white">Sobre la Trobada</h2>
      <div className="prose dark:prose-invert max-w-none text-[#618389] dark:text-gray-300 leading-relaxed">
        {aboutParagraphs.map((paragraph, index) => (
          <p className={index < lastIndex ? 'mb-4' : ''} key={`${trekId}-about-${index}`}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  )
}
