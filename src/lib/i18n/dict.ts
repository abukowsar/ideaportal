import type { Locale } from "./locale";

type Entry = { bn: string; en: string };

const D = {
  // ---- nav / header ----
  nav_home: { bn: "হোম", en: "Home" },
  nav_submit: { bn: "প্রস্তাব জমা", en: "Submit Proposal" },
  nav_repo: { bn: "আইডিয়া রিপোজিটরি", en: "Idea Repository" },
  nav_admin: { bn: "অ্যাডমিন প্যানেল", en: "Admin Panel" },
  nav_how: { bn: "কীভাবে কাজ করে", en: "How it works" },
  nav_aria: { bn: "প্রধান নেভিগেশন", en: "Main navigation" },
  btn_official_login: { bn: "অফিসিয়াল লগইন", en: "Official Login" },
  logout: { bn: "লগআউট", en: "Log out" },
  brand_name: { bn: "ডিওআইসিটি আইডিয়া পোর্টাল", en: "DoICT Idea Portal" },
  brand_tagline: { bn: "প্রযুক্তিভিত্তিক উদ্ভাবনের জাতীয় প্ল্যাটফর্ম", en: "National Platform for Technology Innovation" },

  // ---- footer ----
  footer_line1: {
    bn: "তথ্য ও যোগাযোগ প্রযুক্তি অধিদপ্তর · গণপ্রজাতন্ত্রী বাংলাদেশ সরকার",
    en: "Department of ICT · Government of the People's Republic of Bangladesh",
  },
  footer_tagline: {
    bn: "নাগরিক উদ্ভাবনের জাতীয় জ্ঞানভান্ডার — সকলের জন্য উন্মুক্ত",
    en: "National Repository of Citizen Innovation — open to everyone",
  },

  footer_about: {
    bn: "তৃণমূলের উদ্ভাবনী ধারণা জমা, জেলা যাচাই, সদর দপ্তরের নির্বাচন ও DPP প্রণয়নের সমন্বিত সরকারি প্ল্যাটফর্ম।",
    en: "One government platform for grassroots ideas — submission, district review, HQ selection and DPP preparation.",
  },
  footer_quick: { bn: "দ্রুত লিংক", en: "Quick links" },
  footer_process: { bn: "প্রস্তাবনার ধাপ", en: "Proposal stages" },
  footer_resources: { bn: "রিসোর্স", en: "Resources" },
  footer_rights: { bn: "সর্বস্বত্ব সংরক্ষিত", en: "All rights reserved" },

  // ---- admin sign-in (/admin) ----
  admin_login_h: { bn: "অ্যাডমিন লগইন", en: "Admin Sign-in" },
  admin_login_p: {
    bn: "পোর্টাল ব্যবস্থাপনা, ব্যবহারকারী ও DPP নিয়ন্ত্রণের জন্য সিস্টেম অ্যাডমিন অ্যাকাউন্ট দিয়ে প্রবেশ করুন।",
    en: "Sign in with a system admin account to manage the portal, users and DPPs.",
  },
  admin_login_not_admin: {
    bn: "এই অ্যাকাউন্টে অ্যাডমিন অনুমতি নেই। কর্মকর্তারা সাধারণ লগইন পাতা ব্যবহার করুন।",
    en: "This account does not have admin access. Officers should use the regular sign-in page.",
  },
  admin_login_officer_link: { bn: "কর্মকর্তা লগইন", en: "Officer sign-in" },

  // ---- login panel ----
  login_panel_eyebrow: { bn: "নিরাপদ কর্মকর্তা প্রবেশ", en: "Secure officer access" },
  login_panel_h: { bn: "আপনার ভূমিকাভিত্তিক কর্মক্ষেত্রে প্রবেশ করুন", en: "Sign in to your role-based workspace" },
  login_feat1: { bn: "উপজেলা ও জেলা — প্রস্তাবনা জমা ও যাচাই", en: "Upazila & district — submit and review proposals" },
  login_feat2: { bn: "সদর দপ্তর — চূড়ান্ত নির্বাচন ও DPP প্রণয়ন", en: "Headquarters — final selection and DPP preparation" },
  login_feat3: { bn: "সব ধাপের অগ্রগতি এক ড্যাশবোর্ডে", en: "Every stage tracked on one dashboard" },
  login_secure_note: { bn: "শুধু অনুমোদিত সরকারি কর্মকর্তাদের জন্য", en: "For authorised government officers only" },

  // ---- home / hero ----
  hero_gov_line: {
    bn: "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার · তথ্য ও যোগাযোগ প্রযুক্তি অধিদপ্তর",
    en: "Government of the People's Republic of Bangladesh · Department of ICT",
  },
  hero_lede: {
    bn: "এআই, আইওটি, ক্লাউড, মোবাইল ও ডেটা-নির্ভর প্রযুক্তি দিয়ে জনসেবার বাস্তব সমস্যার সমাধান — তৃণমূল থেকে উঠে আসা প্রতিটি আইডিয়া এখানে জমা হয়, জেলায় যাচাই হয়, সদর দপ্তরে নির্বাচিত হয় এবং DPP-র মাধ্যমে বাস্তবায়নের পথে এগোয়। প্রতিটি ধারণা সবার জন্য উন্মুক্ত, যাতে একটি উদ্ভাবন আরও হাজারো উদ্ভাবনের অনুপ্রেরণা হয়।",
    en: "Solving real public-service problems with AI, IoT, cloud, mobile and data — every grassroots idea is submitted here, reviewed by the district, selected by headquarters and moved toward implementation through a DPP. Every concept stays open to all, so one innovation can inspire thousands more.",
  },
  hero_cta_repo: { bn: "আইডিয়া রিপোজিটরি দেখুন", en: "View the Idea Repository" },
  hero_cta_how: { bn: "কীভাবে অংশ নেবেন", en: "How to get involved" },
  hero_chip_submit: { bn: "প্রস্তাবনা জমা", en: "Submit Proposal" },
  hero_chip_district: { bn: "জেলা যাচাই", en: "District Review" },
  hero_chip_hq: { bn: "সদর দপ্তর", en: "Headquarters" },
  hero_chip_dpp: { bn: "DPP তৈরি", en: "DPP Creation" },
  stat_total: { bn: "মোট প্রস্তাবনা", en: "Total Proposals" },
  stat_districts: { bn: "জেলা কভারেজ", en: "District Coverage" },
  stat_hq: { bn: "সদর দপ্তরে প্রেরিত", en: "Forwarded to HQ" },
  stat_selected: { bn: "নির্বাচিত উদ্যোগ", en: "Selected Initiatives" },

  // ---- mission ----
  mission_eyebrow: { bn: "কেন এই পোর্টাল", en: "Why this portal" },
  mission_h2: {
    bn: "প্রতিটি নাগরিকের চিন্তা, দেশের কাজে লাগার সুযোগ পায়",
    en: "Every citizen's thinking gets a chance to serve the nation",
  },
  mission_p: {
    bn: "দেশের প্রতিটি উপজেলা তথ্যপ্রযুক্তি কার্যালয় প্রতিদিন মানুষের সমস্যা ও প্রয়োজন সবচেয়ে কাছ থেকে দেখে। সেই অভিজ্ঞতা থেকে উঠে আসা ধারণাগুলোকে একটি স্বচ্ছ, জাতীয় কাঠামোর মধ্যে নিয়ে আসাই এই পোর্টালের লক্ষ্য।",
    en: "Every upazila ICT office in the country sees people's problems and needs up close, every day. This portal exists to bring the ideas that arise from that experience into one transparent, national framework.",
  },
  mission_card1_h3: { bn: "সম্পূর্ণ স্বচ্ছ", en: "Fully Transparent" },
  mission_card1_p: {
    bn: "জমাকৃত প্রতিটি আইডিয়ার মূল কনসেপ্ট রিড-অনলি মোডে সবার জন্য উন্মুক্ত — সিদ্ধান্ত কোথাও অন্ধকারে হয় না।",
    en: "The core concept of every submitted idea is open to everyone in read-only mode — decisions are never made in the dark.",
  },
  mission_card2_h3: { bn: "সারা দেশ কভারেজ", en: "Nationwide Coverage" },
  mission_card2_p: {
    bn: "প্রতিটি জেলা ও উপজেলা থেকে আসা বাস্তব সমস্যা ও সমাধান একই জায়গায় জমা হয়, তুলনা ও শেখার সুযোগ তৈরি করে।",
    en: "Real problems and solutions from every district and upazila land in one place, creating room to compare and learn.",
  },
  mission_card3_h3: { bn: "ছোট আইডিয়া, বড় প্রভাব", en: "Small Idea, Big Impact" },
  mission_card3_p: {
    bn: "একটি উপজেলার সহজ সমাধান জাতীয় নীতিতে রূপ নিতে পারে — এখান থেকেই অনেক উদ্যোগ সদর দপ্তর পর্যন্ত পৌঁছেছে।",
    en: "A simple solution from one upazila can shape national policy — many initiatives have reached headquarters exactly this way.",
  },

  // ---- flow ----
  flow_eyebrow: { bn: "প্রস্তাবনা প্রবাহ", en: "Proposal Flow" },
  flow_h2: {
    bn: "উপজেলা থেকে DPP — চার ধাপের প্রক্রিয়া",
    en: "From Upazila to DPP — a Four-Stage Process",
  },
  flow_p: {
    bn: "আপনার এলাকার উপজেলা কার্যালয়ে জমা দেওয়া একটি ধারণা কীভাবে জাতীয় পর্যায়ে পৌঁছায়, তার পুরো পথ এখানে স্পষ্টভাবে দেখানো হলো।",
    en: "Here is the full path showing exactly how an idea submitted at your local upazila office reaches the national level.",
  },
  flow_step1_stage: { bn: "ধাপ ০১ · উপজেলা", en: "Step 01 · Upazila" },
  flow_step1_h3: { bn: "প্রস্তাবনা জমা", en: "Proposal Submission" },
  flow_step1_p: {
    bn: "উপজেলা কার্যালয়ের সহকারী প্রোগ্রামার/কর্মকর্তা নাগরিক ও মাঠপর্যায়ের পর্যবেক্ষণ থেকে আসা উদ্ভাবনী প্রস্তাবনা পোর্টালে জমা দেন — শিরোনাম, মূল কনসেপ্ট, প্রত্যাশিত প্রভাবসহ।",
    en: "The upazila office's assistant programmer/officer submits innovative proposals arising from citizen and field-level observation — with a title, core concept, and expected impact.",
  },
  flow_step2_stage: { bn: "ধাপ ০২ · জেলা", en: "Step 02 · District" },
  flow_step2_h3: { bn: "যাচাই-বাছাই", en: "Review & Screening" },
  flow_step2_p: {
    bn: "জেলা কার্যালয় প্রস্তাবনাগুলো যাচাই-বাছাই করে। সম্ভাব্যতা, প্রভাব ও বাস্তবায়নযোগ্যতার ভিত্তিতে মূল্যায়ন সম্পন্ন হয়।",
    en: "The district office reviews the proposals. Evaluation is based on feasibility, impact, and implementability.",
  },
  flow_step3_stage: { bn: "ধাপ ০৩ · সদর দপ্তর", en: "Step 03 · Headquarters" },
  flow_step3_h3: { bn: "উল্লেখযোগ্য ১–২টি প্রেরণ", en: "1–2 Notable Proposals Forwarded" },
  flow_step3_p: {
    bn: "জেলা থেকে উল্লেখযোগ্য ১–২টি প্রস্তাব সদর দপ্তরে প্রেরিত হয় এবং জাতীয় পর্যায়ে বাস্তবায়নের জন্য বিবেচিত হয়।",
    en: "1–2 notable proposals from the district are forwarded to headquarters and considered for national-level implementation.",
  },
  flow_step4_stage: { bn: "ধাপ ০৪ · নির্বাচন ও DPP", en: "Step 04 · Selection & DPP" },
  flow_step4_h3: { bn: "DPP তৈরি", en: "DPP Preparation" },
  flow_step4_p: {
    bn: "সদর দপ্তর চূড়ান্তভাবে নির্বাচিত উদ্যোগের জন্য প্রস্তাবনার তথ্য থেকে উন্নয়ন প্রকল্প প্রস্তাব (DPP) প্রণয়ন করে — বাস্তবায়নের পথে প্রথম ধাপ।",
    en: "For each finally selected idea, HQ prepares a Development Project Proforma (DPP) from the proposal data — the first step towards implementation.",
  },
  open_callout_h3: { bn: "উন্মুক্ত কনসেপ্ট রিপোজিটরি", en: "Open Concept Repository" },
  open_callout_p_pre: {
    bn: "জেলা পর্যায়ে বাছাই না হলেও কোনো আইডিয়া হারিয়ে যায় না। জমাকৃত ",
    en: "No idea is lost even if it isn't shortlisted at the district level. The core concept of ",
  },
  open_callout_p_bold: { bn: "প্রতিটি", en: "every" },
  open_callout_p_post: {
    bn: " প্রস্তাবের মূল কনসেপ্ট যেকোনো নাগরিকের জন্য রিড-অনলি মোডে উন্মুক্ত থাকে। ফলে সদর দপ্তর প্রয়োজনে সরাসরি রিপোজিটরি থেকে সম্ভাবনাময় আইডিয়া চিহ্নিত করতে পারে, আর এক জেলার উদ্ভাবন অন্য জেলার জন্য অনুপ্রেরণা হয়ে ওঠে।",
    en: " submitted proposal stays open to any citizen in read-only mode. This lets headquarters identify promising ideas directly from the repository when needed, and one district's innovation becomes inspiration for another.",
  },
  open_callout_note: {
    bn: "সম্পাদনার অধিকার শুধু জমাদানকারী উপজেলা ও যাচাইকারী জেলা কার্যালয়ের; বাকি সবাই কেবল দেখতে পারবেন।",
    en: "Edit rights belong only to the submitting upazila and the reviewing district office; everyone else can only view.",
  },

  // ---- categories ----
  cat_eyebrow: { bn: "আইডিয়া তৈরির শুরু", en: "Where an idea begins" },
  cat_h2: { bn: "আপনার আইডিয়া কোন ক্ষেত্রে?", en: "Which area is your idea in?" },
  cat_p: {
    bn: "প্রতিটি ক্যাটাগরির পাশে একটি প্রশ্ন দেওয়া আছে — নিজের এলাকার প্রেক্ষাপটে ভাবুন, উত্তরটাই হতে পারে আপনার পরবর্তী আইডিয়ার শুরু।",
    en: "Each category comes with a question — think about it in your own local context, and the answer might be the start of your next idea.",
  },
  cat_prompt_digital: {
    bn: "সরকারি অফিসে যাওয়া-আসা কমিয়ে যে সেবা ঘরে বসেই পাওয়া যেতে পারে, তা কী?",
    en: "What service could be delivered from home, cutting down trips to government offices?",
  },
  cat_prompt_ai: {
    bn: "বাংলা ভাষায় কোন কাজটি একটি স্মার্ট সহায়ক সহজ করে দিতে পারে?",
    en: "What task could a smart assistant make easier in the Bangla language?",
  },
  cat_prompt_edu: {
    bn: "আপনার এলাকার শিক্ষার্থীদের কোন দক্ষতার সবচেয়ে বেশি ঘাটতি আছে?",
    en: "Which skill gap is most severe among students in your area?",
  },
  cat_prompt_agri: {
    bn: "কৃষকরা কোন তথ্যের অভাবে সবচেয়ে বেশি ক্ষতির মুখে পড়েন?",
    en: "Which missing piece of information hurts farmers the most?",
  },
  cat_prompt_health: {
    bn: "স্বাস্থ্যকেন্দ্রে সেবা পাওয়ার প্রক্রিয়ায় সবচেয়ে বড় বাধা কোনটি?",
    en: "What's the biggest obstacle in the process of getting served at a health center?",
  },
  cat_prompt_infra: {
    bn: "দুর্গম বা সংযোগবিহীন এলাকায় কোন সমস্যাটি প্রযুক্তি দিয়ে সমাধান করা যায়?",
    en: "Which problem in remote or unconnected areas could technology solve?",
  },

  // ---- showcase ----
  showcase_eyebrow: { bn: "অনুপ্রেরণার জন্য", en: "For inspiration" },
  showcase_h2: {
    bn: "দেশের বিভিন্ন প্রান্ত থেকে উঠে আসা কিছু আইডিয়া",
    en: "A Few Ideas Rising From Across the Country",
  },
  showcase_p: {
    bn: "এই ধারণাগুলো ইতিমধ্যে জেলার যাচাই পার হয়ে সদর দপ্তর পর্যায়ে বিবেচিত হয়েছে।",
    en: "These ideas have already passed district review and are being considered at the headquarters level.",
  },
  showcase_more: { bn: "সম্পূর্ণ রিপোজিটরি ব্রাউজ করুন", en: "Browse the Full Repository" },

  // ---- involve ----
  involve_eyebrow: { bn: "কীভাবে অংশ নেবেন", en: "How to get involved" },
  involve_h2: {
    bn: "আইডিয়া জমা হয় আপনার উপজেলা কার্যালয়ের মাধ্যমে",
    en: "Ideas Are Submitted Through Your Upazila Office",
  },
  involve_p: {
    bn: "সরাসরি এই ওয়েবসাইটে ফর্ম পূরণ না করে, আপনার এলাকার ধারণাটি স্থানীয় উপজেলা তথ্যপ্রযুক্তি কার্যালয় বা ইউনিয়ন ডিজিটাল সেন্টারের কর্মকর্তার সাথে ভাগ করুন। তারা যাচাই করে এটি অফিসিয়াল লগইনের মাধ্যমে পোর্টালে জমা দেবেন — এরপর থেকে পুরো যাত্রা আপনি রিপোজিটরিতে সরাসরি দেখতে পারবেন।",
    en: "Instead of filling out a form directly on this website, share your idea with an officer at your local upazila ICT office or Union Digital Center. After review, they will submit it to the portal through an official login — from then on, you can follow the whole journey directly in the repository.",
  },
  involve_step1: {
    bn: "আপনার এলাকার সমস্যা বা সুযোগ চিহ্নিত করুন — উপরের ক্যাটাগরি প্রশ্নগুলো সহায়ক হতে পারে।",
    en: "Identify a problem or opportunity in your area — the category questions above can help.",
  },
  involve_step2: {
    bn: "স্থানীয় উপজেলা তথ্যপ্রযুক্তি/ডিজিটাল সেন্টার কার্যালয়ে গিয়ে ধারণাটি জানান।",
    en: "Visit your local upazila ICT/Digital Center office and share the idea.",
  },
  involve_step3: {
    bn: "কর্মকর্তা প্রস্তাবটি পোর্টালে জমা দিলে একটি ডকেট নম্বর তৈরি হয়।",
    en: "Once the officer submits the proposal to the portal, a docket number is generated.",
  },
  involve_step4: {
    bn: "রিপোজিটরিতে ডকেট নম্বর দিয়ে অগ্রগতি অনুসরণ করুন।",
    en: "Track progress in the repository using the docket number.",
  },
  involve_cta1: { bn: "চলমান আইডিয়াগুলো দেখুন", en: "See Ongoing Ideas" },
  involve_cta2: { bn: "কর্মকর্তা হিসেবে লগইন", en: "Log In as an Officer" },
  flow_illus_step1: { bn: "সমস্যা চিহ্নিত করুন", en: "Identify the Problem" },
  flow_illus_step2: { bn: "উপজেলা অফিসে জানান", en: "Visit Upazila Office" },
  flow_illus_step3: { bn: "ডকেট নম্বর পান", en: "Get a Docket Number" },
  flow_illus_step4: { bn: "অগ্রগতি অনুসরণ করুন", en: "Track Progress" },

  // ---- login ----
  login_h2: { bn: "কর্মকর্তা লগইন", en: "Officer Login" },
  login_p: {
    bn: "অফিস ইউজারনেম ও পাসওয়ার্ড দিয়ে পোর্টালে প্রবেশ করুন।",
    en: "Sign in to the portal with your office username and password.",
  },
  login_label_username: { bn: "ইউজারনেম", en: "Username" },
  login_label_password: { bn: "পাসওয়ার্ড", en: "Password" },
  login_placeholder_username: { bn: "যেমন: hq", en: "e.g. hq" },
  login_error_required: { bn: "ইউজারনেম ও পাসওয়ার্ড উভয়ই প্রয়োজন।", en: "Both username and password are required." },
  login_error_invalid: { bn: "ইউজারনেম বা পাসওয়ার্ড সঠিক নয়।", en: "Incorrect username or password." },
  login_submit: { bn: "প্রবেশ করুন", en: "Log In" },
  login_submitting: { bn: "প্রবেশ করা হচ্ছে…", en: "Signing in…" },
  login_hint_label: { bn: "ডেমো অ্যাকাউন্ট:", en: "Demo accounts:" },
  login_hint_hq: { bn: "(সদর দপ্তর)", en: "(Headquarters)" },
  login_hint_etc: { bn: "ইত্যাদি", en: "etc." },
  login_hint_district: { bn: "(জেলা কার্যালয়)", en: "(District Office)" },
  login_hint_upazila: { bn: "(উপজেলা কার্যালয়)", en: "(Upazila Office)" },
  login_hint_password_label: { bn: "পাসওয়ার্ড (সব অ্যাকাউন্ট):", en: "Password (all accounts):" },

  // ---- submit ----
  submit_eyebrow: { bn: "ধাপ ০১ · উপজেলা কার্যালয়", en: "Step 01 · Upazila Office" },
  submit_restricted_h2: { bn: "নতুন প্রস্তাবনা জমা", en: "New Proposal Submission" },
  submit_restricted_pre: {
    bn: "প্রস্তাবনা জমাদানের অধিকার শুধুমাত্র উপজেলা ও জেলা কার্যালয়ের অ্যাকাউন্টের জন্য সংরক্ষিত। আপনি ",
    en: "Submitting proposals is reserved for Upazila and District office accounts only. You can view all proposals in the ",
  },
  submit_restricted_link: { bn: "আইডিয়া রিপোজিটরিতে", en: "Idea Repository" },
  submit_restricted_post: {
    bn: " সব প্রস্তাবনা দেখতে এবং আপনার এখতিয়ারভুক্ত প্রস্তাবনা যাচাই করতে পারবেন।",
    en: ".",
  },
  submit_h2: { bn: "নতুন প্রস্তাবনা জমা দিন", en: "Submit a New Proposal" },
  submit_p: {
    bn: "জমাদানের পর প্রস্তাবটি স্বয়ংক্রিয়ভাবে একটি ডকেট নম্বর পাবে এবং সংশ্লিষ্ট জেলা কার্যালয়ের যাচাই-তালিকায় যুক্ত হবে। মূল কনসেপ্টটি একই সাথে উন্মুক্ত রিপোজিটরিতে রিড-অনলি মোডে প্রদর্শিত হবে।",
    en: "After submission, the proposal automatically receives a docket number and is added to the relevant district office's review list. The core concept is simultaneously shown in the open repository in read-only mode.",
  },
  form_title_label: { bn: "প্রস্তাবনার শিরোনাম", en: "Proposal Title" },
  form_title_placeholder: {
    bn: "যেমন: ইউনিয়ন ডিজিটাল সেন্টারে এআই-ভিত্তিক সেবা সহায়ক",
    en: "e.g. AI-based service assistant at the Union Digital Center",
  },
  form_category_label: { bn: "ক্যাটাগরি", en: "Category" },
  form_select_placeholder: { bn: "নির্বাচন করুন", en: "Select" },
  form_district_label: { bn: "জেলা", en: "District" },
  form_upazila_label: { bn: "উপজেলা", en: "Upazila" },
  form_submitter_label: { bn: "জমাদানকারী কর্মকর্তা", en: "Submitting Officer" },
  form_submitter_hint: { bn: "লগইন থেকে স্বয়ংক্রিয়ভাবে যুক্ত হয়েছে", en: "Auto-filled from your login" },
  form_officer_name_label: { bn: "কর্মকর্তার নাম", en: "Officer's Name" },
  form_concept_label: { bn: "সমস্যার সংক্ষিপ্ত বিবরণ", en: "Brief Description of the Problem" },
  form_concept_placeholder: {
    bn: "সমস্যাটি কী এবং এটি কাদের প্রভাবিত করে — ৩–৫ বাক্যে লিখুন। এই অংশটিই রিড-অনলি রিপোজিটরিতে সকল কর্মকর্তার জন্য উন্মুক্ত থাকবে।",
    en: "What's the problem, and who does it affect — write 3–5 sentences. This section stays open to all officers in the read-only repository.",
  },
  form_impact_label: { bn: "প্রত্যাশিত ফলাফল ও উপকারভোগী", en: "Expected Outcome & Beneficiaries" },
  form_impact_placeholder: {
    bn: "উপকারভোগীর সামাজিক অবস্থা ও সংখ্যা, প্রত্যাশিত প্রভাব, অন্যান্য তথ্য ইত্যাদি।",
    en: "Beneficiaries' social status and number, expected impact, other relevant details, etc.",
  },
  form_required_msg: {
    bn: "অনুগ্রহ করে তারকা (*) চিহ্নিত সব ঘর পূরণ করুন।",
    en: "Please fill in all fields marked with an asterisk (*).",
  },
  submit_success_pre: { bn: "প্রস্তাবনা গৃহীত হয়েছে · ডকেট নম্বর ", en: "Proposal accepted · Docket No. " },
  submit_success_post: {
    bn: " — যাচাই-তালিকায় যুক্ত হলো এবং উন্মুক্ত রিপোজিটরিতে প্রদর্শিত হচ্ছে।",
    en: " — added to the review list and now showing in the open repository.",
  },
  submit_button: { bn: "প্রস্তাবনা জমা দিন", en: "Submit Proposal" },
  submit_button_loading: { bn: "জমা হচ্ছে…", en: "Submitting…" },
  submit_err_role: {
    bn: "শুধুমাত্র উপজেলা বা জেলা কার্যালয়ের কর্মকর্তারা প্রস্তাবনা জমা দিতে পারবেন।",
    en: "Only Upazila or District office officers can submit proposals.",
  },
  submit_err_no_district: {
    bn: "আপনার একাউন্টে জেলা তথ্য নেই। প্রশাসকের সাথে যোগাযোগ করুন।",
    en: "Your account has no district info. Please contact the administrator.",
  },
  submit_err_category: { bn: "সঠিক ক্যাটাগরি নির্বাচন করুন।", en: "Please select a valid category." },
  submit_err_solution: {
    bn: "সমাধান প্রক্রিয়ার সংক্ষিপ্ত বিবরণ আবশ্যক।",
    en: "A brief description of the solution is required.",
  },

  // ---- submit: official format section (public/innovationform.pdf) ----
  submit_eyebrow_district: { bn: "ধাপ ০২ · জেলা কার্যালয়", en: "Step 02 · District Office" },
  submit_official_format_note: {
    bn: "এই ফর্মটি অফিসিয়াল",
    en: "This form follows the official",
  },
  submit_official_format_link: { bn: "উদ্ভাবন প্রকল্প ছক", en: "Innovation Project Format" },
  submit_official_format_note_post: {
    bn: "অনুসরণ করে তৈরি। প্রয়োজনে মূল ফাইলটি ডাউনলোড করে অফলাইনে পূরণ করে রাখতে পারেন।",
    en: ". You can also download the original file to prepare offline first, if you prefer.",
  },
  section_solution: { bn: "সমাধান", en: "Solution" },
  form_solution_label: { bn: "সমাধান প্রক্রিয়ার সংক্ষিপ্ত বিবরণ", en: "Brief Description of the Solution" },
  form_solution_placeholder: {
    bn: "প্রস্তাবিত সমাধানটি কীভাবে কাজ করবে তা সংক্ষেপে লিখুন।",
    en: "Briefly describe how the proposed solution would work.",
  },
  form_current_process_label: { bn: "বিদ্যমান প্রসেস ম্যাপ (অবস্থা)", en: "Current Process Map (as-is)" },
  form_current_process_placeholder: {
    bn: "বর্তমানে প্রক্রিয়াটি কীভাবে চলে, ধাপে ধাপে লিখুন। (ঐচ্ছিক)",
    en: "Describe the current process, step by step. (optional)",
  },
  form_proposed_process_label: { bn: "প্রস্তাবিত প্রসেস ম্যাপ (পরিবর্তন)", en: "Proposed Process Map (to-be)" },
  form_proposed_process_placeholder: {
    bn: "পরিবর্তনের পর প্রক্রিয়াটি কেমন হবে, ধাপে ধাপে লিখুন। (ঐচ্ছিক)",
    en: "Describe what the process will look like after the change, step by step. (optional)",
  },
  section_pilot: { bn: "পাইলট ও বাস্তবায়ন", en: "Pilot & Implementation" },
  form_pilot_location_label: { bn: "পাইলটের স্থান", en: "Pilot Location" },
  form_implementation_time_label: { bn: "বাস্তবায়নের সময়", en: "Implementation Timeline" },
  section_team: { bn: "টিম সদস্য", en: "Team Members" },
  team_leader: { bn: "টিম লিডার", en: "Team Leader" },
  team_member_n: { bn: "সদস্য {n}", en: "Member {n}" },
  team_field_name: { bn: "নাম", en: "Name" },
  team_field_designation: { bn: "পদবী", en: "Designation" },
  team_field_address: { bn: "ঠিকানা", en: "Address" },
  team_field_mobile: { bn: "মোবাইল", en: "Mobile" },
  team_field_email: { bn: "ইমেইল", en: "Email" },
  section_resources: { bn: "প্রয়োজনীয় রিসোর্স", en: "Required Resources" },
  form_resource_financial_label: { bn: "আর্থিক", en: "Financial" },
  form_resource_manpower_label: { bn: "জনবল", en: "Manpower" },
  form_resource_technical_label: { bn: "কারিগরি", en: "Technical" },
  form_resource_other_label: { bn: "অন্যান্য", en: "Other" },
  form_resource_source_label: { bn: "রিসোর্সের যোগান", en: "Resource Source" },
  section_work_plan: { bn: "কর্মপরিকল্পনা", en: "Work Plan" },
  work_plan_task: { bn: "কাজ", en: "Task" },
  work_plan_who: { bn: "কে করবে?", en: "Who will do it?" },
  work_plan_timeline: { bn: "সময়কাল (মাস/তারিখ)", en: "Timeline (month/date)" },
  work_plan_risk: { bn: "চ্যালেঞ্জ/ঝুঁকি", en: "Challenge/Risk" },
  work_plan_add_row: { bn: "+ সারি যুক্ত করুন", en: "+ Add row" },
  team_add_member: { bn: "+ সদস্য যুক্ত করুন", en: "+ Add member" },
  team_remove_member: { bn: "মুছুন", en: "Remove" },
  work_plan_remove_row: { bn: "মুছুন", en: "Remove" },
  optional_tag: { bn: "(ঐচ্ছিক)", en: "(optional)" },

  // ---- repo ----
  repo_eyebrow: { bn: "উন্মুক্ত জ্ঞানভান্ডার", en: "Open Knowledge Base" },
  repo_h2: { bn: "আইডিয়া রিপোজিটরি", en: "Idea Repository" },
  repo_p: {
    bn: "অধিদপ্তরের সকল কর্মকর্তার জন্য উন্মুক্ত। যেকোনো কার্ডে ক্লিক করে বিস্তারিত দেখুন — সম্পাদনা কেবল সংশ্লিষ্ট উপজেলা ও জেলা কার্যালয়ের এখতিয়ারে।",
    en: "Open to all officers of the department. Click any card to view details — editing rights belong only to the relevant upazila and district office.",
  },
  ro_strip: { bn: "READ-ONLY · সকল DoICT কর্মকর্তা", en: "READ-ONLY · All DoICT Officers" },
  repo_search_placeholder: { bn: "শিরোনাম বা কনসেপ্টে খুঁজুন…", en: "Search by title or concept…" },
  filter_all_districts: { bn: "সব জেলা", en: "All Districts" },
  filter_all_statuses: { bn: "সব স্ট্যাটাস", en: "All Statuses" },
  repo_empty: {
    bn: "কোনো প্রস্তাবনা পাওয়া যায়নি। ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।",
    en: "No proposals found. Try adjusting the filters.",
  },
  action_start_district: { bn: "জেলায় যাচাই শুরু করুন", en: "Start District Review" },
  action_forward_hq: { bn: "সদর দপ্তরে প্রেরণ করুন", en: "Forward to Headquarters" },
  action_final_select: { bn: "চূড়ান্তভাবে নির্বাচিত করুন", en: "Mark as Finally Selected" },
  modal_submitted_by: { bn: "জমাদানকারী:", en: "Submitted by:" },
  modal_cell_district: { bn: "জেলা", en: "District" },
  modal_cell_upazila: { bn: "উপজেলা", en: "Upazila" },
  modal_cell_category: { bn: "ক্যাটাগরি", en: "Category" },
  modal_cell_status: { bn: "বর্তমান স্ট্যাটাস", en: "Current Status" },
  modal_expected_impact: { bn: "প্রত্যাশিত প্রভাব:", en: "Expected impact:" },
  modal_ro_note: {
    bn: "রিড-অনলি ভিউ — এই প্রস্তাবটি সম্পাদনার অধিকার কেবল জমাদানকারী উপজেলা ও যাচাইকারী জেলা কার্যালয়ের।",
    en: "Read-only view — editing rights for this proposal belong only to the submitting upazila and the reviewing district office.",
  },
  close: { bn: "বন্ধ করুন", en: "Close" },
  repo_err_login: { bn: "লগইন প্রয়োজন।", en: "Login required." },
  repo_err_not_found: { bn: "প্রস্তাবনা খুঁজে পাওয়া যায়নি।", en: "Proposal not found." },
  repo_err_not_your_district: {
    bn: "এই প্রস্তাবনাটি আপনার জেলার আওতাভুক্ত নয়।",
    en: "This proposal is not under your district's jurisdiction.",
  },
  repo_err_no_action_here: {
    bn: "এই স্ট্যাটাসে জেলা কার্যালয়ের কোনো পদক্ষেপ নেই।",
    en: "The district office has no action available at this status.",
  },
  repo_err_hq_only: {
    bn: "শুধুমাত্র সদর দপ্তরে প্রেরিত প্রস্তাবনা নির্বাচন করা যাবে।",
    en: "Only proposals forwarded to headquarters can be selected.",
  },
  repo_err_role_forbidden: {
    bn: "আপনার ভূমিকায় এই পদক্ষেপ নেওয়ার অনুমতি নেই।",
    en: "Your role isn't permitted to take this action.",
  },
  repo_err_already_final: {
    bn: "এই প্রস্তাবনা ইতিমধ্যে চূড়ান্ত ধাপে রয়েছে।",
    en: "This proposal is already at its final stage.",
  },

  // ---- admin: shell ----
  admin_close_aria: { bn: "হোমে ফিরুন", en: "Back to home" },
  admin_home: { bn: "হোম", en: "Home" },
  admin_eyebrow: { bn: "অ্যাডমিন", en: "Admin" },
  admin_control_room: { bn: "নিয়ন্ত্রণ কক্ষ", en: "Control Room" },
  admin_nav_action_center: { bn: "কার্যক্রম কেন্দ্র", en: "Action Center" },
  admin_nav_analytics: { bn: "পরিসংখ্যান", en: "Analytics" },
  admin_nav_ideas: { bn: "ইনোভেশন তালিকা", en: "Innovation List" },
  admin_nav_users: { bn: "ব্যবহারকারী", en: "Users" },
  admin_pending_actions: { bn: "অপেক্ষমাণ কার্যক্রম", en: "Pending Actions" },
  admin_total_users: { bn: "মোট ব্যবহারকারী", en: "Total Users" },
  admin_panel_eyebrow: { bn: "অ্যাডমিন প্যানেল", en: "Admin Panel" },
  restricted_area: { bn: "সংরক্ষিত এলাকা", en: "Restricted Area" },
  admin_restricted: {
    bn: "এই অংশটি শুধুমাত্র সিস্টেম অ্যাডমিনিস্ট্রেটরদের জন্য সংরক্ষিত।",
    en: "This section is reserved for system administrators only.",
  },
  admin_restricted_home_text: {
    bn: "এই অংশটি শুধুমাত্র সিস্টেম অ্যাডমিনিস্ট্রেটরদের জন্য সংরক্ষিত। আপনার অ্যাকাউন্টে এই পাতা দেখার অনুমতি নেই।",
    en: "This section is reserved for system administrators only. Your account does not have permission to view this page.",
  },
  back_to_home: { bn: "← হোম এ ফিরুন", en: "← Back to home" },

  // ---- admin: action center ----
  action_center_eyebrow: { bn: "কার্যক্রম কেন্দ্র", en: "Action Center" },
  action_center_h2: { bn: "প্রাপ্ত প্রস্তাবনায় পদক্ষেপ নিন", en: "Take Action on Received Proposals" },
  action_center_p: {
    bn: "প্রতিটি প্রস্তাবনা এখন কোন ধাপে আছে তা এক নজরে দেখুন এবং সরাসরি এখান থেকেই পরবর্তী ধাপে পাঠান, আগের ধাপে ফেরত দিন বা চূড়ান্তভাবে নির্বাচিত করুন।",
    en: "See at a glance what stage every proposal is at, and act directly from here — advance it, send it back, or mark it as finally selected.",
  },
  review_search_placeholder: {
    bn: "শিরোনাম, ডকেট বা জমাদানকারী দিয়ে খুঁজুন…",
    en: "Search by title, docket, or submitter…",
  },
  advance_to_district: { bn: "জেলায় পাঠান →", en: "Send to District →" },
  advance_to_hq: { bn: "সদর দপ্তরে পাঠান →", en: "Send to HQ →" },
  advance_final_select: { bn: "চূড়ান্ত নির্বাচন", en: "Final Selection" },
  send_back: { bn: "← ফেরত", en: "← Send back" },
  send_back_full: { bn: "← আগের ধাপে ফেরত পাঠান", en: "← Send back to previous stage" },
  delete_label: { bn: "মুছুন", en: "Delete" },
  processing: { bn: "প্রক্রিয়াধীন…", en: "Processing…" },
  no_proposals_at_stage: { bn: "এই ধাপে কোনো প্রস্তাবনা নেই।", en: "No proposals at this stage." },
  submitted_by_label: { bn: "জমাদানকারী:", en: "Submitted by:" },
  today: { bn: "আজ", en: "Today" },
  yesterday: { bn: "গতকাল", en: "Yesterday" },
  days_ago: { bn: "{n} দিন আগে", en: "{n} days ago" },
  months_ago: { bn: "{n} মাস আগে", en: "{n} months ago" },
  confirm_delete_idea: {
    bn: '"{title}" ({docket}) প্রস্তাবনাটি স্থায়ীভাবে মুছে ফেলতে চান?',
    en: 'Permanently delete the proposal "{title}" ({docket})?',
  },
  confirm_delete_user: {
    bn: '"{name}" ({username}) অ্যাকাউন্টটি মুছে ফেলতে চান?',
    en: 'Delete the account "{name}" ({username})?',
  },

  // ---- admin: ideas list ----
  ideas_h2: { bn: "ইনোভেশন তালিকা", en: "Innovation List" },
  ideas_p: {
    bn: "সব প্রস্তাবনা দেখুন, এখতিয়ার নির্বিশেষে স্ট্যাটাস পরিবর্তন করুন অথবা মুছে ফেলুন।",
    en: "View all proposals, change status regardless of jurisdiction, or delete.",
  },
  th_docket: { bn: "ডকেট", en: "Docket" },
  th_title: { bn: "শিরোনাম", en: "Title" },
  th_district_upazila: { bn: "জেলা / উপজেলা", en: "District / Upazila" },
  th_submitted_by: { bn: "জমাদানকারী", en: "Submitted By" },
  th_status: { bn: "স্ট্যাটাস", en: "Status" },
  no_proposals_found: { bn: "কোনো প্রস্তাবনা পাওয়া যায়নি।", en: "No proposals found." },

  // ---- admin: users ----
  users_h2: { bn: "ব্যবহারকারী ব্যবস্থাপনা", en: "User Management" },
  users_p: {
    bn: "উপজেলা, জেলা, সদর দপ্তর ও অ্যাডমিন অ্যাকাউন্ট তৈরি ও পরিচালনা করুন।",
    en: "Create and manage Upazila, District, Headquarters, and Admin accounts.",
  },
  users_search_placeholder: { bn: "ইউজারনেম, নাম বা জেলা দিয়ে খুঁজুন…", en: "Search by username, name, or district…" },
  new_user_button: { bn: "+ নতুন ব্যবহারকারী", en: "+ New User" },
  create_user_title: { bn: "নতুন ব্যবহারকারী তৈরি", en: "Create New User" },
  edit_user_title: { bn: "সম্পাদনা:", en: "Edit:" },
  field_username: { bn: "ইউজারনেম", en: "Username" },
  field_password: { bn: "পাসওয়ার্ড", en: "Password" },
  field_password_keep: { bn: "অপরিবর্তিত রাখতে ফাঁকা রাখুন", en: "Leave blank to keep unchanged" },
  field_name: { bn: "নাম", en: "Name" },
  field_role: { bn: "ভূমিকা", en: "Role" },
  save_button: { bn: "সংরক্ষণ করুন", en: "Save" },
  save_button_loading: { bn: "সংরক্ষণ হচ্ছে…", en: "Saving…" },
  cancel_button: { bn: "বাতিল", en: "Cancel" },
  th_name: { bn: "নাম", en: "Name" },
  th_role: { bn: "ভূমিকা", en: "Role" },
  th_proposals: { bn: "প্রস্তাবনা", en: "Proposals" },
  edit_button: { bn: "সম্পাদনা", en: "Edit" },
  no_users_found: { bn: "কোনো ব্যবহারকারী পাওয়া যায়নি।", en: "No users found." },
  admin_err_permission: { bn: "অ্যাডমিন অনুমতি প্রয়োজন।", en: "Admin permission required." },
  admin_err_create_required: {
    bn: "ইউজারনেম, পাসওয়ার্ড ও নাম আবশ্যক।",
    en: "Username, password, and name are required.",
  },
  admin_err_password_len: {
    bn: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
    en: "Password must be at least 6 characters.",
  },
  admin_err_invalid_role: { bn: "অবৈধ ভূমিকা নির্বাচন করা হয়েছে।", en: "Invalid role selected." },
  admin_err_username_used: { bn: "এই ইউজারনেম ইতিমধ্যে ব্যবহৃত হয়েছে।", en: "This username is already in use." },
  admin_err_name_required: { bn: "নাম আবশ্যক।", en: "Name is required." },
  admin_err_self_demote: {
    bn: "নিজের অ্যাকাউন্ট থেকে অ্যাডমিন ভূমিকা প্রত্যাহার করা যাবে না।",
    en: "You cannot remove the admin role from your own account.",
  },
  admin_err_self_delete: { bn: "নিজের অ্যাকাউন্ট মুছে ফেলা যাবে না।", en: "You cannot delete your own account." },
  admin_err_invalid_status: { bn: "অবৈধ স্ট্যাটাস।", en: "Invalid status." },
  admin_err_has_ideas: {
    bn: "এই ব্যবহারকারীর নামে {count}টি প্রস্তাবনা জমা আছে — মুছে ফেলার আগে প্রস্তাবনাগুলো সরিয়ে ফেলুন।",
    en: "This user has {count} submitted proposal(s) — remove them before deleting the account.",
  },

  // ---- admin: analytics ----
  analytics_h2: { bn: "পরিসংখ্যান", en: "Analytics" },
  analytics_p: {
    bn: "মোট {total}টি প্রস্তাবনার ধাপ, ভৌগোলিক বিস্তার, ক্যাটাগরি ও মাসভিত্তিক প্রবণতা।",
    en: "Stage, geographic spread, category, and monthly trend across {total} total proposals.",
  },
  chart_status_title: { bn: "ধাপ অনুযায়ী বিতরণ", en: "Distribution by Stage" },
  chart_trend_title: { bn: "মাসভিত্তিক জমাকৃত প্রস্তাবনা", en: "Monthly Submitted Proposals" },
  chart_district_title: { bn: "জেলাভিত্তিক প্রস্তাবনা", en: "Proposals by District" },
  chart_category_title: { bn: "ক্যাটাগরি অনুযায়ী প্রস্তাবনা", en: "Proposals by Category" },
  chart_no_data: { bn: "কোনো তথ্য নেই।", en: "No data available." },
  chart_bar_tooltip: { bn: "{label}: {value}টি ({share}%)", en: "{label}: {value} ({share}%)" },
  chart_trend_tooltip: { bn: "{label}: {value}টি", en: "{label}: {value}" },

  // ---- DPP (Development Project Proforma) builder ----
  nav_dpp: { bn: "DPP তৈরি", en: "DPP Builder" },
  dpp_create_button: { bn: "DPP তৈরি", en: "Create DPP" },
  dpp_status_none: { bn: "DPP শুরু হয়নি", en: "DPP not started" },
  dpp_status_draft: { bn: "DPP খসড়া", en: "DPP draft" },
  dpp_status_ready: { bn: "DPP প্রস্তুত", en: "DPP ready" },
  dpp_start: { bn: "DPP তৈরি শুরু করুন", en: "Start DPP" },
  dpp_continue: { bn: "DPP সম্পাদনা", en: "Edit DPP" },
  dpp_view: { bn: "DPP দেখুন", en: "View DPP" },
  dpp_hub_eyebrow: { bn: "উন্নয়ন প্রকল্প প্রস্তাব (DPP)", en: "Development Project Proforma (DPP)" },
  dpp_hub_h2: { bn: "নির্বাচিত উদ্যোগ থেকে DPP তৈরি", en: "Build DPPs from selected ideas" },
  dpp_hub_p: {
    bn: "সদর দপ্তর কর্তৃক নির্বাচিত প্রতিটি উদ্যোগ স্বয়ংক্রিয়ভাবে এখানে DPP তৈরির জন্য প্রস্তুত থাকে। প্রস্তাবনার তথ্য থেকে খসড়া আগেই পূরণ হয়ে যায় — ব্যয় ও অর্থায়ন যোগ করে চূড়ান্ত করুন।",
    en: "Every idea selected by HQ lands here, ready for its DPP. The draft is pre-filled from the proposal — add the cost and financing, then finalize.",
  },
  dpp_hub_p_readonly: {
    bn: "আপনার এলাকার নির্বাচিত উদ্যোগগুলোর DPP প্রণয়নের অগ্রগতি এখানে দেখুন।",
    en: "Track DPP preparation for the selected ideas in your area.",
  },
  dpp_hub_empty: { bn: "এখনো কোনো উদ্যোগ নির্বাচিত হয়নি।", en: "No ideas have been selected yet." },
  dpp_kpi_selected: { bn: "নির্বাচিত উদ্যোগ", en: "Selected ideas" },
  dpp_kpi_waiting: { bn: "DPP অপেক্ষমাণ", en: "Awaiting DPP" },
  dpp_kpi_draft: { bn: "খসড়া চলছে", en: "Drafts in progress" },
  dpp_kpi_ready: { bn: "DPP প্রস্তুত", en: "DPPs ready" },
  dpp_filter_all: { bn: "সব", en: "All" },
  dpp_back: { bn: "← DPP তালিকা", en: "← DPP list" },
  dpp_just_selected: {
    bn: "উদ্যোগটি নির্বাচিত হয়েছে এবং DPP তৈরির জন্য প্রস্তুত। প্রস্তাবনার তথ্য থেকে খসড়া পূরণ করা হয়েছে — যাচাই করে সংরক্ষণ করুন।",
    en: "The idea is selected and ready for its DPP. The draft has been pre-filled from the proposal — review it and save.",
  },
  dpp_source_note: {
    bn: "খসড়াটি প্রস্তাবনার (উদ্ভাবন প্রকল্প ছক) তথ্য থেকে পূরণ করা হয়েছে। কাঠামো: পরিকল্পনা কমিশনের DPP, অংশ-ক (প্রকল্পের সংক্ষিপ্তসার)।",
    en: "Pre-filled from the proposal (Innovation Project Format). Structure: Planning Commission DPP, Part-A (Project Summary).",
  },
  dpp_sec_identity: { bn: "১. প্রকল্পের পরিচিতি", en: "1. Project identity" },
  dpp_sec_period: { bn: "২. অবস্থান ও বাস্তবায়নকাল", en: "2. Location & implementation period" },
  dpp_sec_background: { bn: "৩. পটভূমি ও উদ্দেশ্য", en: "3. Background & objectives" },
  dpp_sec_activities: { bn: "৪. প্রধান কার্যক্রম ও প্রত্যাশিত ফলাফল", en: "4. Main activities & expected outputs" },
  dpp_sec_cost: { bn: "৫. প্রাক্কলিত ব্যয় (লক্ষ টাকায়)", en: "5. Estimated cost (lakh Tk)" },
  dpp_sec_finance: { bn: "৬. অর্থায়নের উৎস (লক্ষ টাকায়)", en: "6. Mode of financing (lakh Tk)" },
  dpp_sec_analysis: { bn: "৭. সম্ভাব্যতা, জনবল, ঝুঁকি ও টেকসইতা", en: "7. Feasibility, manpower, risk & sustainability" },
  dpp_f_project_name: { bn: "প্রকল্পের নাম (বাংলা)", en: "Project name (Bangla)" },
  dpp_f_project_name_en: { bn: "প্রকল্পের নাম (ইংরেজি)", en: "Project name (English)" },
  dpp_f_ministry: { bn: "উদ্যোগী মন্ত্রণালয়/বিভাগ", en: "Sponsoring ministry/division" },
  dpp_f_agency: { bn: "বাস্তবায়নকারী সংস্থা", en: "Executing agency" },
  dpp_f_location: { bn: "প্রকল্প এলাকা", en: "Project area" },
  dpp_f_start: { bn: "শুরুর মাস", en: "Start month" },
  dpp_f_end: { bn: "সমাপ্তির মাস", en: "End month" },
  dpp_f_period: { bn: "বাস্তবায়নকাল", en: "Implementation period" },
  dpp_f_duration: { bn: "মেয়াদ", en: "Duration" },
  dpp_months: { bn: "{n} মাস", en: "{n} months" },
  dpp_f_background: { bn: "পটভূমি ও যৌক্তিকতা", en: "Background & rationale" },
  dpp_f_objectives: { bn: "প্রকল্পের উদ্দেশ্য", en: "Objectives" },
  dpp_f_alignment: {
    bn: "৮ম পঞ্চবার্ষিক পরিকল্পনা / SDG / স্মার্ট বাংলাদেশের সাথে সম্পর্ক",
    en: "Link with the 8th Five Year Plan / SDGs / Smart Bangladesh",
  },
  dpp_f_activities: { bn: "প্রধান কার্যক্রম (অঙ্গভিত্তিক)", en: "Main activities (by component)" },
  dpp_f_outputs: { bn: "প্রত্যাশিত ফলাফল ও সুবিধাভোগী", en: "Expected outputs & beneficiaries" },
  dpp_f_feasibility: { bn: "সম্ভাব্যতা যাচাই / পাইলটিং অভিজ্ঞতা", en: "Feasibility / piloting experience" },
  dpp_f_manpower: { bn: "জনবল কাঠামো", en: "Manpower" },
  dpp_f_risks: { bn: "ঝুঁকি ও প্রশমন কৌশল", en: "Risks & mitigation" },
  dpp_f_sustainability: {
    bn: "টেকসইতা ও প্রকল্প-পরবর্তী পরিচালন পরিকল্পনা",
    en: "Sustainability & post-project operation plan",
  },
  dpp_c_item: { bn: "অঙ্গ / খাত", en: "Component / item" },
  dpp_c_unit: { bn: "একক", en: "Unit" },
  dpp_c_qty: { bn: "পরিমাণ", en: "Qty" },
  dpp_c_unit_cost: { bn: "একক মূল্য", en: "Unit cost" },
  dpp_c_total: { bn: "মোট", en: "Total" },
  dpp_c_add: { bn: "+ খাত যোগ করুন", en: "+ Add item" },
  dpp_c_remove: { bn: "খাতটি সরান", en: "Remove item" },
  dpp_c_grand: { bn: "সর্বমোট প্রাক্কলিত ব্যয়", en: "Total estimated cost" },
  dpp_fund_gob: { bn: "জিওবি (সরকারি অর্থায়ন)", en: "GoB" },
  dpp_fund_own: { bn: "সংস্থার নিজস্ব অর্থায়ন", en: "Own fund" },
  dpp_fund_other: { bn: "অন্যান্য / উন্নয়ন সহযোগী", en: "Other / development partner" },
  dpp_fund_total: { bn: "মোট অর্থায়ন", en: "Total financing" },
  dpp_fund_gap: { bn: "মোট ব্যয়ের সাথে পার্থক্য: {n} লক্ষ টাকা", en: "Differs from total cost by {n} lakh Tk" },
  dpp_fund_balanced: { bn: "ব্যয় ও অর্থায়ন সমান ✓", en: "Cost and financing match ✓" },
  dpp_fund_fill_gob: { bn: "বাকিটা জিওবি-তে দিন", en: "Put the balance in GoB" },
  dpp_lakh: { bn: "লক্ষ টাকা", en: "lakh Tk" },
  dpp_checklist_title: { bn: "চূড়ান্ত করার প্রস্তুতি", en: "Ready to finalize?" },
  dpp_chk_identity: { bn: "প্রকল্পের নাম, মন্ত্রণালয় ও সংস্থা", en: "Name, ministry & agency" },
  dpp_chk_location: { bn: "প্রকল্প এলাকা", en: "Project area" },
  dpp_chk_period: { bn: "বাস্তবায়নকাল (শুরু ≤ সমাপ্তি)", en: "Implementation period (start ≤ end)" },
  dpp_chk_objectives: { bn: "পটভূমি ও উদ্দেশ্য", en: "Background & objectives" },
  dpp_chk_activities: { bn: "কার্যক্রম ও প্রত্যাশিত ফলাফল", en: "Activities & outputs" },
  dpp_chk_cost: { bn: "ব্যয় প্রাক্কলন (প্রতিটি খাতের নামসহ)", en: "Cost estimate (every item named)" },
  dpp_chk_finance: { bn: "মোট অর্থায়ন = মোট ব্যয়", en: "Financing equals total cost" },
  dpp_progress: { bn: "{done}/{total} সম্পন্ন", en: "{done}/{total} done" },
  dpp_save_draft: { bn: "খসড়া সংরক্ষণ", en: "Save draft" },
  dpp_finalize: { bn: "চূড়ান্ত করুন", en: "Finalize" },
  dpp_reopen: { bn: "সংশোধনের জন্য খুলুন", en: "Reopen for revision" },
  dpp_print: { bn: "প্রিন্ট / PDF", en: "Print / PDF" },
  dpp_saved: { bn: "খসড়া সংরক্ষিত হয়েছে ✓", en: "Draft saved ✓" },
  dpp_finalized: { bn: "DPP চূড়ান্ত হয়েছে ✓", en: "DPP finalized ✓" },
  dpp_unsaved: { bn: "অসংরক্ষিত পরিবর্তন আছে", en: "Unsaved changes" },
  dpp_locked_note: {
    bn: "এই DPP চূড়ান্ত করা হয়েছে এবং সম্পাদনা বন্ধ। সংশোধন প্রয়োজন হলে “সংশোধনের জন্য খুলুন” চাপুন।",
    en: "This DPP is finalized and locked. Use “Reopen for revision” if changes are needed.",
  },
  dpp_readonly_note: {
    bn: "DPP প্রণয়ন করে সদর দপ্তর। আপনি এটি দেখতে ও প্রিন্ট করতে পারবেন।",
    en: "DPPs are prepared by HQ. You can view and print it.",
  },
  dpp_not_started_note: {
    bn: "সদর দপ্তর এখনো এই উদ্যোগের DPP প্রণয়ন শুরু করেনি।",
    en: "HQ has not started this idea's DPP yet.",
  },
  dpp_prepared_by: { bn: "প্রণয়নকারী", en: "Prepared by" },
  dpp_finalized_on: { bn: "চূড়ান্তকরণ", en: "Finalized on" },
  dpp_last_saved: { bn: "সর্বশেষ সংরক্ষণ", en: "Last saved" },
  dpp_source_idea: { bn: "উৎস প্রস্তাবনা", en: "Source proposal" },
  dpp_print_title: { bn: "উন্নয়ন প্রকল্প প্রস্তাব (DPP)", en: "Development Project Proforma (DPP)" },
  dpp_print_part: { bn: "অংশ-ক: প্রকল্পের সংক্ষিপ্তসার", en: "Part-A: Project Summary" },
  dpp_print_draft_mark: { bn: "খসড়া", en: "DRAFT" },
  dpp_err_role: { bn: "শুধু সদর দপ্তর বা অ্যাডমিন DPP সম্পাদনা করতে পারেন।", en: "Only HQ or admins can edit a DPP." },
  dpp_err_not_selected: { bn: "শুধু নির্বাচিত উদ্যোগের DPP তৈরি করা যায়।", en: "A DPP can only be built for a selected idea." },
  dpp_err_locked: { bn: "চূড়ান্ত DPP সম্পাদনার আগে সংশোধনের জন্য খুলুন।", en: "Reopen the finalized DPP before editing." },
  dpp_err_name: { bn: "প্রকল্পের নাম আবশ্যক।", en: "Project name is required." },
  dpp_err_incomplete: {
    bn: "চূড়ান্ত করার আগে চেকলিস্টের সব অংশ পূরণ করুন।",
    en: "Complete every checklist item before finalizing.",
  },

  // ---- admin sidebar collapse ----
  sidebar_collapse: { bn: "সাইডবার সংকুচিত করুন", en: "Collapse sidebar" },
  sidebar_expand: { bn: "সাইডবার বিস্তৃত করুন", en: "Expand sidebar" },

  // ---- employee dashboard ----
  nav_dashboard: { bn: "ড্যাশবোর্ড", en: "Dashboard" },
  nav_workspace: { bn: "আমার কর্মক্ষেত্র", en: "My workspace" },
  dash_eyebrow: { bn: "আমার কর্মক্ষেত্র", en: "My workspace" },
  dash_welcome: { bn: "স্বাগতম, {name}", en: "Welcome, {name}" },
  dash_sub_upazila: {
    bn: "আপনার জমাকৃত প্রস্তাবনাগুলো কোন ধাপে আছে তা এক নজরে দেখুন।",
    en: "See at a glance where each of your submitted proposals stands.",
  },
  dash_sub_district: {
    bn: "{district} জেলার প্রস্তাবনা যাচাই করুন এবং উল্লেখযোগ্যগুলো সদর দপ্তরে পাঠান।",
    en: "Review proposals from {district} district and forward the notable ones to HQ.",
  },
  dash_sub_hq: {
    bn: "সারা দেশ থেকে সদর দপ্তরে প্রেরিত প্রস্তাবনা থেকে চূড়ান্ত নির্বাচন করুন।",
    en: "Make final selections from proposals forwarded to headquarters from across the country.",
  },
  dash_kpi_mine: { bn: "আমার প্রস্তাবনা", en: "My proposals" },
  dash_kpi_district: { bn: "জেলার প্রস্তাবনা", en: "District proposals" },
  dash_kpi_pending: { bn: "আপনার পদক্ষেপ প্রয়োজন", en: "Awaiting your action" },
  dash_kpi_in_progress: { bn: "প্রক্রিয়াধীন", en: "In progress" },
  dash_kpi_upazilas: { bn: "অংশগ্রহণকারী উপজেলা", en: "Participating upazilas" },
  dash_queue_title: { bn: "আপনার পদক্ষেপ প্রয়োজন", en: "Needs your action" },
  dash_queue_empty: { bn: "এই মুহূর্তে আপনার কোনো অপেক্ষমাণ কাজ নেই।", en: "Nothing is waiting on you right now." },
  dash_mine_title: { bn: "আমার জমাকৃত প্রস্তাবনা", en: "My submissions" },
  dash_mine_empty: { bn: "আপনি এখনো কোনো প্রস্তাবনা জমা দেননি।", en: "You haven't submitted any proposals yet." },
  dash_selected_title: { bn: "সাম্প্রতিক নির্বাচিত", en: "Recently selected" },
  dash_selected_empty: { bn: "এখনো কোনো প্রস্তাবনা নির্বাচিত হয়নি।", en: "No proposals have been selected yet." },
  dash_forwarded_title: { bn: "সদর দপ্তরে প্রেরিত ও নির্বাচিত", en: "Forwarded to HQ & selected" },
  dash_forwarded_empty: {
    bn: "এখনো কোনো প্রস্তাবনা সদর দপ্তরে পাঠানো হয়নি।",
    en: "No proposals have been forwarded to HQ yet.",
  },
  dash_new_proposal: { bn: "নতুন প্রস্তাবনা", en: "New proposal" },
  dash_view_repo: { bn: "সম্পূর্ণ রিপোজিটরি", en: "Full repository" },
  dash_pipeline_title: { bn: "প্রস্তাবনা প্রবাহ", en: "Proposal pipeline" },
  dash_action_done: { bn: "✓ সম্পন্ন", en: "✓ Done" },
  view_details: { bn: "বিস্তারিত", en: "Details" },

  // ---- export & print ----
  export_csv: { bn: "CSV ডাউনলোড", en: "Download CSV" },
  export_err_login: { bn: "ডাউনলোডের জন্য লগইন প্রয়োজন।", en: "Please log in to download." },
  print_button: { bn: "প্রিন্ট / PDF", en: "Print / PDF" },
  print_now: { bn: "প্রিন্ট বা PDF হিসেবে সংরক্ষণ করুন", en: "Print or save as PDF" },
  print_back: { bn: "← ফিরে যান", en: "← Back" },
  print_submitted_on: { bn: "জমার তারিখ", en: "Submitted on" },
  print_generated_on: { bn: "মুদ্রণের তারিখ", en: "Printed on" },
  print_signature: { bn: "স্বাক্ষর ও সিল", en: "Signature & seal" },

  // ---- officer / admin workspace shell ----
  ws_officer_eyebrow: { bn: "কর্মকর্তা", en: "Officer" },
  ws_officer_title: { bn: "কর্মক্ষেত্র", en: "Workspace" },
  ws_nav_main: { bn: "মূল মেনু", en: "Main menu" },
  ws_nav_tools: { bn: "টুলস ও রিসোর্স", en: "Tools & resources" },
  ws_export: { bn: "CSV ডাউনলোড", en: "Download CSV" },
  ws_official_format: { bn: "অফিসিয়াল ফরম্যাট (PDF)", en: "Official format (PDF)" },
  ws_public_repo: { bn: "উন্মুক্ত রিপোজিটরি", en: "Public repository" },

  // ---- technology & maturity ----
  tech_label: { bn: "ব্যবহৃত প্রযুক্তি", en: "Technologies" },
  maturity_label: { bn: "উদ্ভাবনের পর্যায়", en: "Innovation stage" },
  form_tech_label: { bn: "ব্যবহৃত প্রযুক্তি", en: "Technologies used" },
  form_tech_hint: {
    bn: "আপনার সমাধানে যে প্রযুক্তিগুলো ব্যবহার হবে সেগুলো নির্বাচন করুন (এক বা একাধিক)।",
    en: "Select the technologies your solution uses (one or more).",
  },
  form_maturity_label: { bn: "আইডিয়াটি এখন কোন পর্যায়ে?", en: "How far along is the idea?" },
  form_tech_required: { bn: "অন্তত একটি প্রযুক্তি নির্বাচন করুন।", en: "Select at least one technology." },
  stat_tech: { bn: "ব্যবহৃত প্রযুক্তি", en: "Technologies in use" },

  // ---- repository filters ----
  filter_all_tech: { bn: "সব প্রযুক্তি", en: "All technologies" },
  filter_all_maturity: { bn: "সব পর্যায়", en: "All stages" },
  sort_label: { bn: "সাজান", en: "Sort" },
  sort_newest: { bn: "সর্বশেষ জমা", en: "Newest first" },
  sort_advanced: { bn: "সবচেয়ে অগ্রসর", en: "Most advanced" },
  sort_title: { bn: "শিরোনাম অনুযায়ী", en: "By title" },
  repo_result_count: { bn: "{n}টি আইডিয়া", en: "{n} ideas" },
  repo_clear_filters: { bn: "ফিল্টার মুছুন", en: "Clear filters" },

  // ---- public idea page ----
  idea_back: { bn: "রিপোজিটরিতে ফিরুন", en: "Back to repository" },
  idea_share: { bn: "লিংক কপি করুন", en: "Copy link" },
  idea_copied: { bn: "লিংক কপি হয়েছে", en: "Link copied" },
  idea_open_page: { bn: "পূর্ণ পাতা", en: "Full page" },
  idea_journey: { bn: "প্রস্তাবনার যাত্রা", en: "Proposal journey" },
  idea_related: { bn: "একই প্রযুক্তির আরও আইডিয়া", en: "More ideas using the same technology" },
  idea_concept_h: { bn: "মূল ধারণা", en: "Core concept" },
  idea_impact_h: { bn: "প্রত্যাশিত প্রভাব", en: "Expected impact" },
  idea_details_h: { bn: "বিস্তারিত প্রস্তাবনা", en: "Full proposal" },

  // ---- home: technology radar & spotlight ----
  radar_eyebrow: { bn: "প্রযুক্তি রাডার", en: "Technology radar" },
  radar_h2: { bn: "কোন প্রযুক্তিতে উদ্ভাবন হচ্ছে?", en: "Which technologies are driving innovation?" },
  radar_p: {
    bn: "মাঠপর্যায়ের প্রস্তাবনাগুলো কোন কোন প্রযুক্তি ব্যবহার করছে — যেকোনোটিতে ক্লিক করে সংশ্লিষ্ট আইডিয়াগুলো দেখুন।",
    en: "The technologies behind field-level proposals — click any to explore the ideas that use it.",
  },
  radar_ideas: { bn: "{n}টি আইডিয়া", en: "{n} ideas" },
  radar_none: { bn: "এখনো নেই", en: "None yet" },
  spotlight_eyebrow: { bn: "উদ্ভাবন স্পটলাইট", en: "Innovation spotlight" },
  maturity_eyebrow: { bn: "ধারণা থেকে বাস্তবায়ন", en: "From concept to rollout" },
  maturity_h2: { bn: "প্রতিটি আইডিয়ার অগ্রগতি মাপা হয় চার ধাপে", en: "Every idea's progress, measured in four stages" },
  maturity_p: {
    bn: "প্রযুক্তি কতটা প্রস্তুত তা স্পষ্ট থাকলে সঠিক সহায়তা ও বিনিয়োগ সিদ্ধান্ত নেওয়া সহজ হয়।",
    en: "Knowing how ready a technology is makes it easier to decide on the right support and investment.",
  },

  // ---- general UX ----
  menu_toggle: { bn: "মেনু", en: "Menu" },
  loading_text: { bn: "লোড হচ্ছে…", en: "Loading…" },
  nf_title: { bn: "পাতাটি খুঁজে পাওয়া যায়নি", en: "Page not found" },
  nf_p: {
    bn: "আপনি যে ঠিকানাটি খুঁজছেন সেটি নেই বা সরিয়ে ফেলা হয়েছে।",
    en: "The page you're looking for doesn't exist or has been moved.",
  },
} as const satisfies Record<string, Entry>;

export type DictKey = keyof typeof D;

export function t(locale: Locale, key: DictKey): string {
  return D[key][locale];
}
