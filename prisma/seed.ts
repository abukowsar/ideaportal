import "dotenv/config";
import { Maturity, PrismaClient, Status } from "@prisma/client";
import bcrypt from "bcryptjs";


const prisma = new PrismaClient();

const DEMO_PASSWORD = "demo1234";

const DIST_CODE: Record<string, string> = {
  ঢাকা: "DHA",
  চট্টগ্রাম: "CTG",
  লক্ষ্মীপুর: "LAK",
  কুমিল্লা: "CUM",
  বগুড়া: "BOG",
  রাজশাহী: "RAJ",
  খুলনা: "KHU",
  সিলেট: "SYL",
  রংপুর: "RAN",
  বরিশাল: "BAR",
  ময়মনসিংহ: "MYM",
  কিশোরগঞ্জ: "KIS",
};

const DISTRICT_SLUGS: Record<string, string> = {
  ঢাকা: "dhaka",
  চট্টগ্রাম: "chattogram",
  লক্ষ্মীপুর: "lakshmipur",
  কুমিল্লা: "cumilla",
  বগুড়া: "bogura",
  রাজশাহী: "rajshahi",
  খুলনা: "khulna",
  সিলেট: "sylhet",
  রংপুর: "rangpur",
  বরিশাল: "barisal",
  ময়মনসিংহ: "mymensingh",
  কিশোরগঞ্জ: "kishoreganj",
};

const UPAZILA_SLUGS: Record<string, string> = {
  রায়পুর: "raipur",
  পটিয়া: "patiya",
  শেরপুর: "sherpur",
  ডুমুরিয়া: "dumuria",
  পবা: "paba",
  দাউদকান্দি: "daudkandi",
  ইটনা: "itna",
  জাফলং: "jaflong",
  মেহেন্দিগঞ্জ: "mehendiganj",
};

const seqByDist: Record<string, number> = {};
function nextDocket(district: string, year = 2026) {
  const code = DIST_CODE[district] ?? "GEN";
  const key = `${code}/${year}`;
  seqByDist[key] = (seqByDist[key] ?? 0) + 1;
  return `DoICT/${code}/IDEA/${year}/${String(seqByDist[key]).padStart(3, "0")}`;
}

const IDEAS: Array<{
  title: string;
  category: string;
  district: string;
  upazila: string;
  concept: string;
  impact: string;
  status: Status;
  techTags: string[];
  maturity: Maturity;
}> = [
  {
    title: "ইউনিয়ন ডিজিটাল সেন্টারে এআই সেবা সহায়ক",
    category: "এআই ও ডেটা",
    district: "লক্ষ্মীপুর",
    upazila: "রায়পুর",
    concept:
      "ইউনিয়ন ডিজিটাল সেন্টারে আগত নাগরিকদের সাধারণ সরকারি সেবার প্রশ্নের উত্তর দিতে বাংলা ভাষার এআই চ্যাট সহায়ক। উদ্যোক্তার কাজের চাপ কমবে এবং সেবাপ্রার্থীর অপেক্ষার সময় হ্রাস পাবে।",
    impact: "দৈনিক গড়ে ৬০+ সেবাপ্রার্থী উপকৃত; সেবা প্রদানের গড় সময় ৪০% হ্রাসের সম্ভাবনা।",
    status: Status.HQ,
    techTags: ["AI","WEB","DATA"],
    maturity: Maturity.PROTOTYPE,
  },
  {
    title: "উপজেলা পর্যায়ে সাইবার সচেতনতা মোবাইল ইউনিট",
    category: "শিক্ষা ও দক্ষতা",
    district: "চট্টগ্রাম",
    upazila: "পটিয়া",
    concept:
      "স্কুল-কলেজে ঘুরে ঘুরে সাইবার নিরাপত্তা, ডিজিটাল প্রতারণা ও তথ্য যাচাই বিষয়ে হাতে-কলমে প্রশিক্ষণ দেওয়ার ভ্রাম্যমাণ ইউনিট — DoICT উপজেলা কার্যালয়ের নেতৃত্বে।",
    impact: "বছরে ৮,০০০+ শিক্ষার্থীর কাছে সরাসরি সচেতনতা কার্যক্রম পৌঁছাবে।",
    status: Status.SELECTED,
    techTags: ["CYBER","MOBILE"],
    maturity: Maturity.PILOT,
  },
  {
    title: "কৃষকের জন্য ভয়েস-ভিত্তিক আবহাওয়া ও বাজারদর সেবা",
    category: "কৃষি ও পরিবেশ",
    district: "বগুড়া",
    upazila: "শেরপুর",
    concept:
      "স্মার্টফোন ছাড়াই সাধারণ ফোনকলে ভয়েস মেনুর মাধ্যমে স্থানীয় আবহাওয়া, বীজ-সারের পরামর্শ ও দৈনিক বাজারদর শোনার ব্যবস্থা। স্থানীয় কৃষি অফিসের ডেটার সাথে সংযুক্ত।",
    impact: "উপজেলার প্রায় ৪৫,০০০ কৃষি-নির্ভর পরিবারের তথ্যপ্রাপ্তি সহজ হবে।",
    status: Status.DISTRICT,
    techTags: ["SMS","DATA","CLOUD"],
    maturity: Maturity.PROTOTYPE,
  },
  {
    title: "ডিজিটাল সেবা কিয়স্ক: হাসপাতালের টিকিট ও সিরিয়াল",
    category: "স্বাস্থ্যসেবা",
    district: "খুলনা",
    upazila: "ডুমুরিয়া",
    concept:
      "উপজেলা স্বাস্থ্য কমপ্লেক্সে সেলফ-সার্ভিস কিয়স্কে রোগীর টিকিট, সিরিয়াল ও বিভাগভিত্তিক দিকনির্দেশনা — বাংলা ইন্টারফেস ও প্রিন্টেড টোকেনসহ।",
    impact: "বহির্বিভাগে দৈনিক ৩০০+ রোগীর লাইন ব্যবস্থাপনা শৃঙ্খলাবদ্ধ হবে।",
    status: Status.DISTRICT,
    techTags: ["WEB","CLOUD"],
    maturity: Maturity.PILOT,
  },
  {
    title: "স্কুল আইসিটি ল্যাব মনিটরিং ড্যাশবোর্ড",
    category: "শিক্ষা ও দক্ষতা",
    district: "রাজশাহী",
    upazila: "পবা",
    concept:
      "উপজেলার সব শেখ রাসেল ডিজিটাল ল্যাবের ব্যবহারের হার, যন্ত্রপাতির অবস্থা ও প্রশিক্ষণ সেশনের তথ্য এক ড্যাশবোর্ডে — জেলা ও সদর দপ্তর রিয়েলটাইমে দেখতে পারবে।",
    impact: "ল্যাব অব্যবহৃত থাকার হার চিহ্নিত করে সদ্ব্যবহার ৩০% বাড়ানোর লক্ষ্য।",
    status: Status.HQ,
    techTags: ["IOT","DATA","WEB"],
    maturity: Maturity.PILOT,
  },
  {
    title: "ভূমি অফিসের সেবা ট্র্যাকিং এসএমএস নোটিফিকেশন",
    category: "ডিজিটাল সেবা",
    district: "কুমিল্লা",
    upazila: "দাউদকান্দি",
    concept:
      "নামজারিসহ ভূমি অফিসের আবেদন কোন ধাপে আছে তা আবেদনকারীকে স্বয়ংক্রিয় এসএমএসে জানানো — দালালনির্ভরতা ও অফিসে অপ্রয়োজনীয় যাতায়াত কমাতে।",
    impact: "মাসে ১,২০০+ আবেদনকারীর হয়রানি ও যাতায়াত ব্যয় হ্রাস।",
    status: Status.UPAZILA,
    techTags: ["SMS","WEB"],
    maturity: Maturity.CONCEPT,
  },
  {
    title: "হাওরাঞ্চলে অফলাইন-ফার্স্ট শিক্ষা কনটেন্ট সার্ভার",
    category: "অবকাঠামো ও সংযোগ",
    district: "কিশোরগঞ্জ",
    upazila: "ইটনা",
    concept:
      "ইন্টারনেট-সীমিত হাওর এলাকার স্কুলে লোকাল ওয়াই-ফাই সার্ভারে জাতীয় শিক্ষা কনটেন্ট (ভিডিও, বই, কুইজ) অফলাইনে সরবরাহ; মাসে একবার সিংক।",
    impact: "সংযোগবিহীন ১৮টি বিদ্যালয়ের ৫,৫০০ শিক্ষার্থী ডিজিটাল কনটেন্টের আওতায় আসবে।",
    status: Status.DISTRICT,
    techTags: ["IOT","CLOUD"],
    maturity: Maturity.PROTOTYPE,
  },
  {
    title: "পর্যটন তথ্যের কিউআর-ভিত্তিক বহুভাষিক গাইড",
    category: "ডিজিটাল সেবা",
    district: "সিলেট",
    upazila: "জাফলং",
    concept:
      "পর্যটন স্পটে স্থাপিত কিউআর কোড স্ক্যান করলে বাংলা-ইংরেজিতে স্থানের ইতিহাস, নিরাপত্তা নির্দেশনা ও জরুরি হেল্পলাইন — কোনো অ্যাপ ইনস্টল ছাড়াই।",
    impact: "বছরে লক্ষাধিক পর্যটকের তথ্যপ্রাপ্তি ও নিরাপত্তা সচেতনতা বৃদ্ধি।",
    status: Status.UPAZILA,
    techTags: ["MOBILE","GIS","AI"],
    maturity: Maturity.CONCEPT,
  },
  {
    title: "দুর্যোগকালীন কমিউনিটি তথ্য রিলে নেটওয়ার্ক",
    category: "অবকাঠামো ও সংযোগ",
    district: "বরিশাল",
    upazila: "মেহেন্দিগঞ্জ",
    concept:
      "ঘূর্ণিঝড়ে মোবাইল নেটওয়ার্ক বিপর্যয়ের সময় ইউনিয়ন পরিষদ ভবনকেন্দ্রিক লো-পাওয়ার রেডিও রিলে দিয়ে আশ্রয়কেন্দ্র ও ত্রাণ তথ্য প্রচারের ব্যবস্থা।",
    impact: "উপকূলীয় ৯টি ইউনিয়নের ৭০,০০০+ বাসিন্দার জরুরি তথ্যপ্রাপ্তি নিশ্চিত।",
    status: Status.UPAZILA,
    techTags: ["IOT","GIS","SMS"],
    maturity: Maturity.CONCEPT,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  console.log("Seeding users...");

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash,
      name: "সিস্টেম অ্যাডমিন",
      role: "ADMIN",
    },
  });

  const hq = await prisma.user.upsert({
    where: { username: "hq" },
    update: {},
    create: {
      username: "hq",
      passwordHash,
      name: "সদর দপ্তর কর্মকর্তা",
      role: "HQ",
    },
  });

  const districtUsers = new Map<string, string>();
  for (const [district, slug] of Object.entries(DISTRICT_SLUGS)) {
    const username = `district-${slug}`;
    const user = await prisma.user.upsert({
      where: { username },
      update: {},
      create: {
        username,
        passwordHash,
        name: `জেলা কার্যালয়, ${district}`,
        role: "DISTRICT",
        district,
      },
    });
    districtUsers.set(district, user.id);
  }

  const upazilaUsers = new Map<string, string>();
  for (const idea of IDEAS) {
    const key = `${idea.district}::${idea.upazila}`;
    if (upazilaUsers.has(key)) continue;
    const slug = UPAZILA_SLUGS[idea.upazila] ?? idea.upazila;
    const username = `upazila-${slug}`;
    const user = await prisma.user.upsert({
      where: { username },
      update: {},
      create: {
        username,
        passwordHash,
        name: `সহকারী প্রোগ্রামার, ${idea.upazila}`,
        role: "UPAZILA",
        district: idea.district,
        upazila: idea.upazila,
      },
    });
    upazilaUsers.set(key, user.id);
  }

  console.log("Seeding ideas...");
  await prisma.dpp.deleteMany({});
  await prisma.idea.deleteMany({});
  for (const idea of IDEAS) {
    const key = `${idea.district}::${idea.upazila}`;
    await prisma.idea.create({
      data: {
        docket: nextDocket(idea.district),
        title: idea.title,
        category: idea.category,
        district: idea.district,
        upazila: idea.upazila,
        concept: idea.concept,
        impact: idea.impact,
        status: idea.status,
        techTags: idea.techTags,
        maturity: idea.maturity,
        submittedById: upazilaUsers.get(key)!,
      },
    });
  }

  console.log("Seed complete.");
  console.log(`HQ user: hq / ${DEMO_PASSWORD}`);
  console.log(`District users: district-<slug> / ${DEMO_PASSWORD}`);
  console.log(`Upazila users: upazila-<slug> / ${DEMO_PASSWORD}`);
  void hq;
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
