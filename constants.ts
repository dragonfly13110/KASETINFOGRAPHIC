
import { Infographic, DisplayCategory, ALL_TAGS_OPTION } from './types';

export const INITIAL_INFOGRAPHICS: Infographic[] = [
  {
    id: '1',
    title: 'การปลูกข้าวโพดหวานคุณภาพสูง',
    imageUrl: 'https://picsum.photos/seed/kaset1/600/400',
    content: 'ข้าวโพดหวานเป็นพืชเศรษฐกิจที่สำคัญ การปลูกให้ได้คุณภาพสูงต้องเริ่มตั้งแต่การเลือกพันธุ์ การเตรียมดิน การให้น้ำและปุ๋ยอย่างเหมาะสม รวมถึงการป้องกันกำจัดศัตรูพืช...',
    summary: 'เรียนรู้วิธีการปลูกข้าวโพดหวานให้ได้ผลผลิตสูงและมีคุณภาพตรงตามความต้องการของตลาด',
    displayCategory: DisplayCategory.ARTICLE,
    tags: ['ข้าวโพด', 'พืชไร่'], // Simplified
    date: '10 พฤษภาคม 2567',
  },
  {
    id: '2',
    title: 'การป้องกันโรคในต้นทุเรียนหน้าฝน',
    imageUrl: 'https://picsum.photos/seed/kaset2/600/400',
    content: 'ฤดูฝนเป็นช่วงที่ต้นทุเรียนมีความเสี่ยงต่อโรครากเน่าโคนเน่าสูง เกษตรกรควรมีการจัดการสวนที่ดี เช่น การตัดแต่งกิ่งให้โปร่ง การระบายน้ำที่ดี และการใช้ชีวภัณฑ์ป้องกันโรค...',
    summary: 'เทคนิคและแนวทางการป้องกันโรคที่สำคัญในทุเรียนช่วงฤดูฝน เพื่อลดความเสียหายของผลผลิต',
    displayCategory: DisplayCategory.ARTICLE,
    tags: ['ทุเรียน', 'โรคพืช', 'พืชสวน'], // Simplified
    date: '15 พฤษภาคม 2567',
  },
  {
    id: '3',
    title: 'เทคนิคการเลี้ยงปลานิลในบ่อดิน',
    imageUrl: 'https://picsum.photos/seed/kaset3/600/400',
    content: 'ปลานิลเป็นปลาที่เลี้ยงง่าย โตเร็ว และเป็นที่นิยมบริโภค บทความนี้จะแนะนำเทคนิคการเลี้ยงปลานิลในบ่อดิน ตั้งแต่การเตรียมบ่อ การเลือกพันธุ์ปลา การให้อาหาร และการจัดการคุณภาพน้ำ...',
    summary: 'คู่มือฉบับสมบูรณ์สำหรับผู้เริ่มต้นเลี้ยงปลานิลในบ่อดิน ให้ได้ผลผลิตที่ดีและมีกำไร',
    displayCategory: DisplayCategory.TECHNOLOGY,
    tags: ['ปลานิล', 'ประมง'], // Simplified
    date: '22 เมษายน 2567',
  },
  {
    id: '4',
    title: 'โดรนเพื่อการเกษตร: ประโยชน์และการประยุกต์ใช้',
    imageUrl: 'https://picsum.photos/seed/kaset4/600/400',
    content: 'เทคโนโลยีโดรน (Drone) หรืออากาศยานไร้คนขับ ได้เข้ามามีบทบาทสำคัญในภาคการเกษตรสมัยใหม่มากขึ้น ช่วยในการสำรวจพื้นที่ การฉีดพ่นปุ๋ยและสารเคมี การวิเคราะห์สุขภาพพืช และอื่นๆ อีกมากมาย...',
    summary: 'สำรวจศักยภาพของโดรนในการปฏิวัติการทำเกษตรกรรม เพิ่มประสิทธิภาพและลดต้นทุน',
    displayCategory: DisplayCategory.TECHNOLOGY,
    tags: ['โดรน', 'เทคโนโลยีเกษตร'], // Consolidated and simplified
    date: '20 พฤษภาคม 2567',
  },
  {
    id: '5',
    title: 'ระบบ IoT สำหรับฟาร์มอัจฉริยะ',
    imageUrl: 'https://picsum.photos/seed/kaset5/600/400',
    content: 'Internet of Things (IoT) คือเครือข่ายของอุปกรณ์ต่างๆ ที่เชื่อมต่อและแลกเปลี่ยนข้อมูลผ่านอินเทอร์เน็ต ในภาคการเกษตร IoT ถูกนำมาใช้เพื่อสร้างฟาร์มอัจฉริยะ (Smart Farm) โดยเซ็นเซอร์จะเก็บข้อมูลสภาพแวดล้อม เช่น ความชื้นดิน อุณหภูมิ แสง แล้วส่งไปยังระบบควบคุมเพื่อสั่งการทำงานของอุปกรณ์ต่างๆ เช่น ระบบให้น้ำอัตโนมัติ...',
    summary: 'ทำความรู้จักกับ Internet of Things (IoT) และการนำมาประยุกต์ใช้เพื่อสร้างฟาร์มอัจฉริยะ เพิ่มผลผลิตและคุณภาพ',
    displayCategory: DisplayCategory.TECHNOLOGY,
    tags: ['IoT', 'Smart Farm', 'เทคโนโลยีเกษตร'], // Consolidated and simplified
    date: '15 มกราคม 2567',
  },
  {
    id: '6',
    title: 'การจัดการดินและปุ๋ยเพื่อความยั่งยืน',
    imageUrl: 'https://picsum.photos/seed/kaset6/600/400',
    content: 'ดินเป็นทรัพยากรที่มีค่า การจัดการดินและปุ๋ยอย่างถูกวิธีไม่เพียงแต่ช่วยเพิ่มผลผลิต แต่ยังรักษาสภาพแวดล้อมและความยั่งยืนทางการเกษตร การใช้ปุ๋ยอินทรีย์ การปลูกพืชคลุมดิน และการวิเคราะห์ดินเป็นประจำคือหัวใจสำคัญ',
    summary: 'แนวทางการจัดการดินและปุ๋ยอย่างยั่งยืน เพื่อสุขภาพดินที่ดีและผลผลิตที่อุดมสมบูรณ์',
    displayCategory: DisplayCategory.ARTICLE,
    tags: ['การจัดการดินและปุ๋ย', 'เกษตรยั่งยืน', 'ปุ๋ยอินทรีย์'], // Kept specific as these are good categories
    date: '5 มิถุนายน 2567',
  },
  {
    id: '7',
    title: 'Infographic: ขั้นตอนการทำปุ๋ยหมักชีวภาพ',
    imageUrl: 'https://picsum.photos/seed/kaset7/600/400',
    content: 'ปุ๋ยหมักชีวภาพเป็นวิธีที่ดีในการปรับปรุงโครงสร้างดินและเพิ่มธาตุอาหารให้กับพืช Infographic นี้จะแสดงขั้นตอนการทำปุ๋ยหมักอย่างง่าย ตั้งแต่การเตรียมวัสดุ การกองปุ๋ย และการดูแลรักษา...',
    summary: 'Infographic แสดงขั้นตอนการทำปุ๋ยหมักชีวภาพใช้เองง่ายๆ ลดขยะอินทรีย์ เพิ่มผลผลิต',
    displayCategory: DisplayCategory.INFOGRAPHIC,
    tags: ['Infographic', 'ปุ๋ยหมัก', 'เกษตรอินทรีย์', 'DIY'], // Kept specific
    date: '12 มิถุนายน 2567',
  }
];

// Curated list of general tags. The sidebar dynamically generates tags from content,
// but this list can serve as a reference or for future admin features.
export const ALL_CATEGORIES_TAGS: string[] = [
  ALL_TAGS_OPTION,
  'พืชไร่', 
  'พืชสวน', 
  'ประมง', 
  'ปศุสัตว์',
  'เทคโนโลยีเกษตร',
  'Smart Farm', 
  'IoT', 
  'โดรน', 
  'โรคพืช', 
  'การจัดการดินและปุ๋ย', 
  'เกษตรอินทรีย์', 
  'เกษตรยั่งยืน', 
  'ปุ๋ยหมัก',
  'Infographic',
  // Less specific tags from the original list are removed or consolidated above
  // e.g. 'ข้าวโพด', 'ทุเรียน', 'ปลานิล' are item-specific, not general categories for this list.
  // 'คุณภาพสูง', 'นวัตกรรม' are descriptive rather than primary categories.
];

export const PAGE_DESCRIPTIONS: Record<string, { title: string; subtitle: string }> = {
  home: {
    title: "เนื้อหาล่าสุด", 
    subtitle: "แหล่งรวมความรู้เกษตรอินทรีย์ สัตว์เศรษฐกิจ และองค์ความรู้เพื่อคุณ"
  },
  articles: {
    title: "บทความทางการเกษตร",
    subtitle: "รวมบทความน่ารู้ เทคนิค และองค์ความรู้เพื่อเกษตรกร"
  },
  technology: {
    title: "เทคโนโลยีการเกษตร",
    subtitle: "นวัตกรรมและเทคโนโลยีเพื่อการพัฒนการเกษตรอย่างยั่งยืน"
  },
  infographics: { 
    title: "คลัง Infographics",
    subtitle: "รวม Infographics ความรู้ทางการเกษตรที่น่าสนใจและเข้าใจง่าย"
  }
};
