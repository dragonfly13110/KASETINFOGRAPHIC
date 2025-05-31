import React from 'react';

interface LinkItem {
  href: string;
  text: string;
}

interface LinkCategory {
  title: string;
  links: LinkItem[];
}

const knowledgeLinkData: LinkCategory[] = [
  {
    title: "หน่วยงานภาครัฐ",
    links: [
      { href: "https://www.moac.go.th/", text: "กระทรวงเกษตรฯ" },
      { href: "https://www.doa.go.th/", text: "กรมวิชาการเกษตร" },
      { href: "https://www.dld.go.th/", text: "กรมปศุสัตว์" },
      { href: "https://www.rid.go.th/", text: "กรมชลประทาน" },
    ],
  },
  {
    title: "งานวิจัยและข้อมูล",
    links: [
      { href: "https://www.nida.ac.th/", text: "NIDA" },
      { href: "https://agri.cmu.ac.th/", text: "คณะเกษตร มช." },
      { href: "https://www.kasetporpeang.com/", text: "เกษตรพอเพียง" },
    ],
  },
  {
    title: "คลังความรู้",
    links: [
      { href: "https://www.doae.go.th/", text: "กรมส่งเสริมการเกษตร" },
      { href: "https://www.farmbook.com/", text: "FarmBook" },
      { href: "https://www.agrimanthailand.com/", text: "AgriMan Thailand" },
    ],
  },
  {
    title: "ชุมชนออนไลน์",
    links: [
      { href: "https://www.facebook.com/RebelliousKasetTambon", text: "เกษตรตำบล (Facebook)" },
      { href: "https://www.youtube.com/results?search_query=เกษตร", text: "YouTube – เกษตร" },
      { href: "https://pantip.com/tag/เกษตร", text: "Pantip – เกษตร" },
    ],
  },
];

const KnowledgeLinks: React.FC = () => {
  return (
    <section className="bg-gray-50 py-10 mt-16 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-semibold text-brand-green mb-6 text-center">
          แหล่งข้อมูลภาคการเกษตรที่น่าสนใจ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm text-brand-gray-text">
          {knowledgeLinkData.map((category) => (
            <div key={category.title}>
              <h3 className="font-semibold text-brand-gray-darktext mb-2">{category.title}</h3>
              <ul className="space-y-1">
                {category.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KnowledgeLinks;
