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
    title: "หน่วยงานภาครัฐและองค์กร",
    links: [
      { href: "https://www.moac.go.th/", text: "กระทรวงเกษตรและสหกรณ์" },
      { href: "https://www.doa.go.th/", text: "กรมวิชาการเกษตร" },
      { href: "https://www.dld.go.th/", text: "กรมปศุสัตว์" },
      { href: "https://www.doae.go.th/", text: "กรมส่งเสริมการเกษตร" },
    ],
  },
  {
    title: "งานวิจัย มหาวิทยาลัย และข้อมูลวิชาการ",
    links: [
      { href: "https://www.ku.ac.th/th", text: "มหาวิทยาลัยเกษตรศาสตร์" }, // ย้าย NIDA ออก และเน้น ม.เกษตร
      { href: "https://agri.cmu.ac.th/", text: "คณะเกษตรศาสตร์ มช." },
      { href: "https://www.nstda.or.th/home/research-program/agriculture-and-biotechnology/", text: "สวทช. (กลุ่มเกษตรและเทคโนโลยีชีวภาพ)" },
      { href: "https://www.doa.go.th/main/?page_id=123", text: "คลังความรู้ กรมวิชาการเกษตร" }, // เพิ่มคลังความรู้ DOA
    ],
  },
  {
    title: "คลังความรู้และเว็บไซต์เกษตร",
    links: [
      { href: "https://www.rakbankerd.com/agriculture/", text: "รักบ้านเกิด (เกษตร)" },
      { href: "https://www.technologychaoban.com/", text: "เทคโนโลยีชาวบ้าน" },
      { href: "https://www.kasetkaoklai.com/", text: "เกษตรก้าวไกล" }, // เว็บไซต์รวมบทความ เทคนิค
      { href: "https://digital.doae.go.th/", text: "คลังความรู้ดิจิทัล กรมส่งเสริมฯ" }, // แหล่งรวมสื่อดิจิทัลของ DOAE
    ],
  },
  {
    title: "ชุมชนออนไลน์และสื่อ",
    links: [
      { href: "https://www.kasetporpeang.com/", text: "เกษตรพอเพียง (เว็บบอร์ด)" }, // ย้ายมาหมวดนี้ ชัดเจนว่าเป็นชุมชน
      { href: "https://www.facebook.com/groups/kasetorganic", text: "กลุ่มเกษตรอินทรีย์ (Facebook)" }, // ตัวอย่างกลุ่ม Facebook ที่ Active
      { href: "https://www.youtube.com/results?search_query=เกษตรอินทรีย์", text: "YouTube – เกษตรอินทรีย์" }, // ปรับคำค้นหา
      { href: "https://pantip.com/tag/เกษตรกรรม", text: "Pantip – เกษตรกรรม" },
    ],
  },
];

const KnowledgeLinks: React.FC = () => {
  return (
    <section className="bg-gray-50 pt-10 pb-0.5 mt-3 border-t border-gray-200">
      <div className="container mx-auto px-auto">
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