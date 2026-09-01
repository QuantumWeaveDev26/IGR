export type UiLanguage = 'en' | 'kn';

export interface Translations {
  nav: {
    brandSubtitle: string;
    whyIgr: string;
    howItWorks: string;
    results: string;
    whatsappUs: string;
    langEng: string;
    langKn: string;
  };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2Em: string;
    titleLine2End: string;
    copy: string;
    primaryCta: string;
    secondaryCta: string;
    proofAppuBold: string;
    proofAppuDesc: string;
    proofHoursBold: string;
    proofHoursDesc: string;
    proofAiBold: string;
    proofAiDesc: string;
    orbitCuriosity: string;
    orbitClarity: string;
    orbitConfidence: string;
    route1Tag: string;
    route1Title: string;
    route1Desc: string;
    route2Tag: string;
    route2Title: string;
    route2Desc: string;
    route3Tag: string;
    route3Title: string;
    route3Desc: string;
  };
  manifesto: {
    eyebrow: string;
    titleLine1: string;
    titleLine2Italic: string;
    lead: string;
    voiceShowMe: string;
    voiceTellMe: string;
    voiceLetMeTry: string;
    voiceGiveMeTime: string;
    usualRouteLabel: string;
    onePathText: string;
    routeNote: string;
  };
  appuSection: {
    eyebrow: string;
    title: string;
    description: string;
    statement1: string;
    statement2: string;
    statement3: string;
    guideCardEyebrow: string;
    guideCardTitle: string;
    guideCardDesc: string;
  };
  routeSection: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    stations: {
      id: string;
      title: string;
      desc: string;
    }[];
  };
  resultsSection: {
    eyebrow: string;
    title: string;
    intro: string;
    item1Quote: string;
    item1Badge: string;
    item2Quote: string;
    item2Badge: string;
    item3Quote: string;
    item3Badge: string;
    item4Quote: string;
    item4Badge: string;
  };
  differenceSection: {
    eyebrow: string;
    title: string;
    description: string;
    colTraditional: string;
    colIgr: string;
    row1Trad: string;
    row1Igr: string;
    row2Trad: string;
    row2Igr: string;
    row3Trad: string;
    row3Igr: string;
    row4Trad: string;
    row4Igr: string;
    row5Trad: string;
    row5Igr: string;
    row6Trad: string;
    row6Igr: string;
  };
  audienceSection: {
    eyebrow: string;
    title: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
    card4Title: string;
    card4Desc: string;
  };
  finalCta: {
    eyebrow: string;
    titleLine1: string;
    titleLine2Em: string;
    whatsappBtn: string;
    bookCallBtn: string;
    footerSummary: string;
    footerCopyright: string;
  };
  modals: {
    videoTitle: string;
    videoFooterDemo: string;
    earlyAccessTitle: string;
    earlyAccessSubtitle: string;
    parentLabel: string;
    parentPlaceholder: string;
    studentLabel: string;
    studentPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    classLabel: string;
    emailLabel: string;
    emailPlaceholder: string;
    submitBtn: string;
    submittingBtn: string;
    privacyBadge: string;
    successTitle: string;
    successSub: string;
    successMsg: string;
    whatsappConnectBtn: string;
    doneBtn: string;
    closeLabel: string;
  };
  appuChat: {
    headerTitle: string;
    headerSubtitle: string;
    dragTooltip: string;
    ariaToggle: string;
    studentMode: string;
    parentMode: string;
    switchModeStudent: string;
    switchModeParent: string;
    muteVoice: string;
    unmuteVoice: string;
    voiceActive: string;
    voiceMuted: string;
    xpLabel: string;
    streakLabel: string;
    initialGreetingStudent: string;
    initialGreetingParent: string;
    placeholder: string;
    sendLabel: string;
    thinkingText: string;
    suggestedTitle: string;
    suggestions: string[];
    errorNetwork: string;
    errorRateLimit: string;
    audioBlocked: string;
    disclaimer: string;
    whatsappRedirectMsg: string;
    callRedirectMsg: string;
  };
}

export const translations: Record<UiLanguage, Translations> = {
  en: {
    nav: {
      brandSubtitle: 'Instaskills Gamechanger',
      whyIgr: 'Why IGr',
      howItWorks: 'How it works',
      results: 'Results',
      whatsappUs: 'Whatsapp Us',
      langEng: 'ENG',
      langKn: 'ಕನ್ನಡ'
    },
    hero: {
      eyebrow: 'CBSE high school · learning, made personal',
      titleLine1: 'Every learner is different.',
      titleLine2Em: 'Why',
      titleLine2End: ' is education the same?',
      copy: 'IGr is a hyper-personalized learning system that adapts to your child’s pace, strengths and way of understanding—so learning can finally feel like it belongs to them.',
      primaryCta: 'Find your child’s learning route',
      secondaryCta: 'Explore IGr',
      proofAppuBold: 'With APPU',
      proofAppuDesc: 'A favourite guide for every learning moment',
      proofHoursBold: '40 hours',
      proofHoursDesc: 'Build a stronger learning foundation',
      proofAiBold: 'AI-ready',
      proofAiDesc: 'Future skills, naturally included',
      orbitCuriosity: 'curiosity',
      orbitClarity: 'clarity',
      orbitConfidence: 'confidence',
      route1Tag: 'Route 01',
      route1Title: 'See it',
      route1Desc: 'Visual learner',
      route2Tag: 'Route 02',
      route2Title: 'Try it',
      route2Desc: 'Learn by doing',
      route3Tag: 'Route 03',
      route3Title: 'Tell it',
      route3Desc: 'Learn through stories'
    },
    manifesto: {
      eyebrow: '01 / The starting point',
      titleLine1: 'Your child isn’t average.',
      titleLine2Italic: 'Why should their learning be?',
      lead: 'Some need a picture. Some need a story. Some need to try it first. Some simply need another explanation, at their own pace.',
      voiceShowMe: '“Show me.”',
      voiceTellMe: '“Tell me.”',
      voiceLetMeTry: '“Let me try.”',
      voiceGiveMeTime: '“Give me time.”',
      usualRouteLabel: 'The usual route',
      onePathText: 'One path for every learner',
      routeNote: 'When every learner is given the same route, confidence drops. Interest disappears. IGr changes that.'
    },
    appuSection: {
      eyebrow: '02 / Meet IGr',
      title: 'A complete learning system that adapts to your child.',
      description: 'Academic excellence through AI-powered hyper-personalized learning. IGr makes room for how each learner understands—not just what they need to finish.',
      statement1: 'Not another tuition.',
      statement2: 'Not another recorded course.',
      statement3: 'Not another learning app.',
      guideCardEyebrow: 'Your child’s guide',
      guideCardTitle: 'Learn with APPU.',
      guideCardDesc: 'A mentor designed to make learning engaging, memorable and less intimidating.'
    },
    routeSection: {
      eyebrow: '03 / A route that changes with them',
      titleLine1: 'One learner.',
      titleLine2: 'Many ways forward.',
      description: 'Every learning journey draws from the same strong foundation, then adapts to the learner in front of it.',
      stations: [
        { id: '01', title: 'Understand', desc: 'Concepts, not answers to memorise.' },
        { id: '02', title: 'Explore', desc: 'Stories, visuals and examples.' },
        { id: '03', title: 'Practise', desc: 'Small challenges that build belief.' },
        { id: '04', title: 'Reflect', desc: 'Learning that stays with them.' },
        { id: '05', title: 'Grow', desc: 'Progress everyone can see.' }
      ]
    },
    resultsSection: {
      eyebrow: '04 / Within the first 40 hours',
      title: 'First, they notice the difference.',
      intro: 'The first transformation is not just better marks. It is how a child begins to show up for learning. The marks follow the understanding.',
      item1Quote: '“They explain the idea in their own words now.”',
      item1Badge: 'Understanding',
      item2Quote: '“Homework doesn’t start with resistance anymore.”',
      item2Badge: 'Learning habits',
      item3Quote: '“They put their hand up in class.”',
      item3Badge: 'Participation',
      item4Quote: '“They are asking questions I haven’t heard before.”',
      item4Badge: 'Curiosity & confidence'
    },
    differenceSection: {
      eyebrow: '05 / The difference',
      title: 'Learning first. Results follow.',
      description: 'IGr replaces a single, fixed path with a learning journey that is personal, active and designed to grow independence.',
      colTraditional: 'Traditional learning',
      colIgr: 'IGr',
      row1Trad: 'One syllabus for everyone',
      row1Igr: 'Personalized learning journey',
      row2Trad: 'Memorisation',
      row2Igr: 'Concept mastery',
      row3Trad: 'Passive learning',
      row3Igr: 'Gamified engagement',
      row4Trad: 'One teaching style',
      row4Igr: 'Adaptive learning',
      row5Trad: 'Long screen time',
      row5Igr: 'Learn smarter, not longer',
      row6Trad: 'Limited AI exposure',
      row6Igr: 'AI-ready by default'
    },
    audienceSection: {
      eyebrow: '06 / Built for academic excellence',
      title: 'For every family looking beyond tuition.',
      card1Title: 'Parents',
      card1Desc: 'Who want learning to feel more personal, not more pressurised.',
      card2Title: 'Struggling learners',
      card2Desc: 'Who need concepts rebuilt with patience and clarity.',
      card3Title: 'High performers',
      card3Desc: 'Who are ready to go further than the standard route.',
      card4Title: 'Schools',
      card4Desc: 'Preparing learners for a changing, AI-driven future.'
    },
    finalCta: {
      eyebrow: 'Start with a conversation',
      titleLine1: 'Give your child the learning journey they ',
      titleLine2Em: 'deserve.',
      whatsappBtn: 'Whatsapp Us',
      bookCallBtn: 'Book your free discovery call',
      footerSummary: 'Learning that adapts to every learner. Powered by AI. Driven by hyper-personalization. Built for academic excellence.',
      footerCopyright: '© IGr / Instaskills Gamechanger'
    },
    modals: {
      videoTitle: 'See IGr in Action — Promo Video',
      videoFooterDemo: 'Official IGr Demo',
      earlyAccessTitle: 'Apply for Early Access',
      earlyAccessSubtitle: 'Book a 1-on-1 FREE Discovery Call to see how APPU hyper-personalizes CBSE learning for your child.',
      parentLabel: 'Parent / Guardian Name *',
      parentPlaceholder: 'e.g. Ramesh Sharma',
      studentLabel: 'Student Name *',
      studentPlaceholder: 'e.g. Aarav Sharma',
      phoneLabel: 'WhatsApp Phone *',
      phonePlaceholder: '+91 98765 43210',
      classLabel: 'CBSE Class *',
      emailLabel: 'Email Address',
      emailPlaceholder: 'parent@example.com',
      submitBtn: 'Submit Application',
      submittingBtn: 'Sending Application...',
      privacyBadge: '100% Confidential • Zero Spam Guarantee',
      successTitle: 'Application Received!',
      successSub: '✓ Successfully saved & sent to counselor workflow',
      successMsg: 'Thank you. Our academic counselor will reach out shortly to schedule your FREE Discovery Call.',
      whatsappConnectBtn: 'Connect Instantly on WhatsApp',
      doneBtn: 'Done',
      closeLabel: 'Close modal'
    },
    appuChat: {
      headerTitle: 'APPU',
      headerSubtitle: 'AI Academic Mentor',
      dragTooltip: 'Drag me anywhere or click to chat with APPU',
      ariaToggle: 'Toggle APPU chat',
      studentMode: '🎓 Student Mode',
      parentMode: '🌿 Parent Mode',
      switchModeStudent: 'Switch to Parent Mode',
      switchModeParent: 'Switch to Student Mode',
      muteVoice: 'Mute Voice Audio',
      unmuteVoice: 'Unmute Voice Audio',
      voiceActive: 'Audio 🔊',
      voiceMuted: 'Muted 🔇',
      xpLabel: 'XP',
      streakLabel: 'Streak',
      initialGreetingStudent: "Namaste! 👋 I'm **APPU**, your AI Academic Mentor for CBSE Class 6 to 12. Ask me anything about your syllabus, math formulas, physics concepts, or exam prep! 🚀",
      initialGreetingParent: "Namaste! 🌿 I'm **APPU**, your child's 1-on-1 AI Academic Mentor. Ask me about our diagnostic framework, CBSE syllabus tracking, or how IGr transforms study habits.",
      placeholder: 'Ask APPU anything about CBSE concepts...',
      sendLabel: 'Send message',
      thinkingText: 'Appu is thinking with warmth... 💡',
      suggestedTitle: 'Suggested topics',
      suggestions: [
        'Class 10 Light & Optics',
        'Class 9 Polynomials',
        'Send notes to WhatsApp 📲',
        'Set revision reminder 📅'
      ],
      errorNetwork: 'I had a momentary connection glitch. Please try sending your message again!',
      errorRateLimit: 'You have reached the guest message limit. Please book a discovery call to continue!',
      audioBlocked: 'Audio playback was interrupted. You can still read the answer above.',
      disclaimer: 'Powered by IGr APPU AI • Safe & Curated for CBSE',
      whatsappRedirectMsg: 'Connecting you directly to IGr on WhatsApp...',
      callRedirectMsg: 'Connecting you with our CBSE Learning Specialist. Opening your discovery call modal now...'
    }
  },
  kn: {
    nav: {
      brandSubtitle: 'ಇನ್‌ಸ್ಟಾಸ್ಕಿಲ್ಸ್ ಗೇಮ್‌ಚೇಂಜರ್',
      whyIgr: 'ಏಕೆ IGr',
      howItWorks: 'ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',
      results: 'ಫಲಿತಾಂಶಗಳು',
      whatsappUs: 'WhatsApp ನಲ್ಲಿ ಸಂಪರ್ಕಿಸಿ',
      langEng: 'ENG',
      langKn: 'ಕನ್ನಡ'
    },
    hero: {
      eyebrow: 'CBSE ಪ್ರೌಢಶಾಲೆ · ಕಲಿಕೆ, ನಿಮ್ಮ ಮಗುವಿಗೆ ತಕ್ಕಂತೆ',
      titleLine1: 'ಪ್ರತಿಯೊಬ್ಬ ವಿದ್ಯಾರ್ಥಿಯೂ ವಿಶಿಷ್ಟ.',
      titleLine2Em: 'ಹಾಗಿದ್ದಾಗ',
      titleLine2End: ' ಶಿಕ್ಷಣ ಮಾತ್ರ ಎಲ್ಲರಿಗೂ ಒಂದೇ ಏಕೆ?',
      copy: 'IGr ಎಂಬುದು ಮಗುವಿನ ವೇಗ, ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವ ವಿಧಾನಕ್ಕೆ ಹೊಂದಿಕೊಳ್ಳುವ ವಿಶೇಷ ಕಲಿಕಾ ವ್ಯವಸ್ಥೆ—ಇದರಿಂದ ಕಲಿಕೆ ನಿಜವಾಗಿಯೂ ಅವರದ್ದೇ ಎನಿಸುತ್ತದೆ.',
      primaryCta: 'ನಿಮ್ಮ ಮಗುವಿನ ಕಲಿಕಾ ಮಾರ್ಗ ಕಂಡುಕೊಳ್ಳಿ',
      secondaryCta: 'IGr ಅನ್ವೇಷಿಸಿ',
      proofAppuBold: 'ಅಪ್ಪು ಜೊತೆ',
      proofAppuDesc: 'ಪ್ರತಿ ಕಲಿಕೆಯ ಕ್ಷಣಕ್ಕೂ ನೆಚ್ಚಿನ ಮಾರ್ಗದರ್ಶಿ',
      proofHoursBold: '40 ಗಂಟೆಗಳು',
      proofHoursDesc: 'ಗಟ್ಟಿಯಾದ ಕಲಿಕೆಯ ಅಡಿಪಾಯ ನಿರ್ಮಾಣ',
      proofAiBold: 'AI-ಸನ್ನದ್ಧ',
      proofAiDesc: 'ಭವಿಷ್ಯದ ಕೌಶಲ್ಯಗಳು ಸಹಜವಾಗಿ ಒಳಗೊಂಡಿವೆ',
      orbitCuriosity: 'ಕುತೂಹಲ',
      orbitClarity: 'ಸ್ಪಷ್ಟತೆ',
      orbitConfidence: 'ಆತ್ಮವಿಶ್ವಾಸ',
      route1Tag: 'ಮಾರ್ಗ 01',
      route1Title: 'ನೋಡಿ ಕಲಿಯಿರಿ',
      route1Desc: 'ದೃಶ್ಯ ಕಲಿಕಾರ್ಥಿ',
      route2Tag: 'ಮಾರ್ಗ 02',
      route2Title: 'ಮಾಡಿ ಕಲಿಯಿರಿ',
      route2Desc: 'ಪ್ರಾಯೋಗಿಕ ಕಲಿಕೆ',
      route3Tag: 'ಮಾರ್ಗ 03',
      route3Title: 'ಕಥೆಗಳ ಮೂಲಕ',
      route3Desc: 'ಕಥೆಗಳ ಮೂಲಕ ಕಲಿಕೆ'
    },
    manifesto: {
      eyebrow: '01 / ಆರಂಭಿಕ ಹಂತ',
      titleLine1: 'ನಿಮ್ಮ ಮಗು ಸಾಮಾನ್ಯವಲ್ಲ.',
      titleLine2Italic: 'ಅವರ ಕಲಿಕೆ ಮಾತ್ರ ಸಾಮಾನ್ಯವಾಗಬೇಕೇ?',
      lead: 'ಕೆಲವರಿಗೆ ಚಿತ್ರ ಬೇಕು. ಕೆಲವರಿಗೆ ಕಥೆ ಬೇಕು. ಕೆಲವರಿಗೆ ಮೊದಲು ಪ್ರಯೋಗಿಸಿ ನೋಡಬೇಕು. ಇನ್ನು ಕೆಲವರಿಗೆ ತಮ್ಮದೇ ವೇಗದಲ್ಲಿ ಮತ್ತೊಮ್ಮೆ ವಿವರಣೆ ಬೇಕು.',
      voiceShowMe: '“ತೋರಿಸಿ.”',
      voiceTellMe: '“ಹೇಳಿ.”',
      voiceLetMeTry: '“ನಾನು ಪ್ರಯತ್ನಿಸುವೆ.”',
      voiceGiveMeTime: '“ನನಗೆ ಸಮಯ ಕೊಡಿ.”',
      usualRouteLabel: 'ಸಾಮಾನ್ಯ ಮಾರ್ಗ',
      onePathText: 'ಎಲ್ಲಾ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೂ ಒಂದೇ ದಾರಿ',
      routeNote: 'ಪ್ರತಿಯೊಬ್ಬ ಕಲಿಯುವವರಿಗೂ ಒಂದೇ ಮಾರ್ಗ ನೀಡಿದಾಗ, ಆತ್ಮವಿಶ್ವಾಸ ಕುಸಿಯುತ್ತದೆ. ಆಸಕ್ತಿ ಕಳೆದುಹೋಗುತ್ತದೆ. IGr ಅದನ್ನು ಬದಲಾಯಿಸುತ್ತದೆ.'
    },
    appuSection: {
      eyebrow: '02 / IGr ಪರಿಚಯ',
      title: 'ನಿಮ್ಮ ಮಗುವಿಗೆ ಹೊಂದಿಕೊಳ್ಳುವ ಸಂಪೂರ್ಣ ಕಲಿಕಾ ವ್ಯವಸ್ಥೆ.',
      description: 'AI-ಚಾಲಿತ ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಕಲಿಕೆಯ ಮೂಲಕ ಶೈಕ್ಷಣಿಕ ಉತ್ಕೃಷ್ಟತೆ. ಕೇವಲ ಪಠ್ಯ ಮುಗಿಸುವುದಲ್ಲದೆ, ಪ್ರತಿ ವಿದ್ಯಾರ್ಥಿ ಹೇಗೆ ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತಾನೆ ಎಂಬುದಕ್ಕೆ IGr ಆದ್ಯತೆ ನೀಡುತ್ತದೆ.',
      statement1: 'ಇದು ಮತ್ತೊಂದು ಟ್ಯೂಷನ್ ಅಲ್ಲ.',
      statement2: 'ಇದು ಮತ್ತೊಂದು ರೆಕಾರ್ಡ್ ಮಾಡಿದ ಕೋರ್ಸ್ ಅಲ್ಲ.',
      statement3: 'ಇದು ಮತ್ತೊಂದು ಸಾಮಾನ್ಯ ಕಲಿಕಾ ಆ್ಯಪ್ ಅಲ್ಲ.',
      guideCardEyebrow: 'ಮಗುವಿನ ಮಾರ್ಗದರ್ಶಿ',
      guideCardTitle: 'ಅಪ್ಪು ಜೊತೆ ಕಲಿಯಿರಿ.',
      guideCardDesc: 'ಕಲಿಕೆಯನ್ನು ಆಸಕ್ತಿದಾಯಕ, ಸ್ಮರಣೀಯ ಮತ್ತು ಭಯಮುಕ್ತವಾಗಿಸಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ AI ಮಾರ್ಗದರ್ಶಿ.'
    },
    routeSection: {
      eyebrow: '03 / ಮಗುವಿನ ಜೊತೆ ಬದಲಾಗುವ ಮಾರ್ಗ',
      titleLine1: 'ಒಬ್ಬ ವಿದ್ಯಾರ್ಥಿ.',
      titleLine2: 'ಮುನ್ನಡೆಯಲು ಹಲವು ದಾರಿಗಳು.',
      description: 'ಪ್ರತಿ ಕಲಿಕೆಯ ಪಯಣವೂ ಬಲವಾದ ಅಡಿಪಾಯದಿಂದ ಆರಂಭವಾಗಿ, ಮಗುವಿನ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ ರೂಪಾಂತರಗೊಳ್ಳುತ್ತದೆ.',
      stations: [
        { id: '01', title: 'ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ', desc: 'ಕಾನ್ಸೆಪ್ಟ್ ಗ್ರಹಿಕೆ, ಕೇವಲ ಬಾಯಿಪಾಠವಲ್ಲ.' },
        { id: '02', title: 'ಅನ್ವೇಷಿಸಿ', desc: 'ಕಥೆಗಳು, ಚಿತ್ರಗಳು ಮತ್ತು ನೈಜ ಉದಾಹರಣೆಗಳು.' },
        { id: '03', title: 'ಅಭ್ಯಾಸ ಮಾಡಿ', desc: 'ಆತ್ಮವಿಶ್ವಾಸ ಬೆಳೆಸುವ ಸಣ್ಣ ಸವಾಲುಗಳು.' },
        { id: '04', title: 'ಮನನ ಮಾಡಿ', desc: 'ಶಾಶ್ವತವಾಗಿ ನೆನಪಿನಲ್ಲಿ ಉಳಿಯುವ ಕಲಿಕೆ.' },
        { id: '05', title: 'ಮುನ್ನಡೆಯಿರಿ', desc: 'ಎಲ್ಲರಿಗೂ ಕಾಣುವ ಸ್ಪಷ್ಟ ಪ್ರಗತಿ.' }
      ]
    },
    resultsSection: {
      eyebrow: '04 / ಮೊದಲ 40 ಗಂಟೆಗಳಲ್ಲಿ',
      title: 'ಮೊದಲು, ಅವರು ವ್ಯತ್ಯಾಸವನ್ನು ಗಮನಿಸುತ್ತಾರೆ.',
      intro: 'ಮೊದಲ ಬದಲಾವಣೆ ಕೇವಲ ಅಂಕಗಳಲ್ಲಷ್ಟೇ ಅಲ್ಲ. ಮಗು ಕಲಿಕೆಯಲ್ಲಿ ಹೇಗೆ ತೊಡಗಿಸಿಕೊಳ್ಳುತ್ತದೆ ಎಂಬುದರಲ್ಲಿ ಕಾಣುತ್ತದೆ. ಅಂಕಗಳು ತಾನಾಗಿಯೇ ಬರುತ್ತವೆ.',
      item1Quote: '“ಅವರು ಈಗ ತಮ್ಮದೇ ಮಾತುಗಳಲ್ಲಿ ವಿಷಯವನ್ನು ವಿವರಿಸುತ್ತಾರೆ.”',
      item1Badge: 'ಸ್ಪಷ್ಟ ಗ್ರಹಿಕೆ',
      item2Quote: '“ಹೋಮ್‌ವರ್ಕ್ ಮಾಡಲು ಈಗ ಹಠ ಮಾಡುವುದಿಲ್ಲ.”',
      item2Badge: 'ಉತ್ತಮ ಕಲಿಕಾ ಹವ್ಯಾಸ',
      item3Quote: '“ತರಗತಿಯಲ್ಲಿ ಕೈಯೆತ್ತಿ ಧೈರ್ಯವಾಗಿ ಉತ್ತರಿಸುತ್ತಾರೆ.”',
      item3Badge: 'ಸಕ್ರಿಯ ಭಾಗಿತ್ವ',
      item4Quote: '“ಹೊಸ ಹೊಸ ಆಲೋಚನೆಯ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳುತ್ತಿದ್ದಾರೆ.”',
      item4Badge: 'ಕುತೂಹಲ ಮತ್ತು ಆತ್ಮವಿಶ್ವಾಸ'
    },
    differenceSection: {
      eyebrow: '05 / ವ್ಯತ್ಯಾಸ',
      title: 'ಮೊದಲು ಕಲಿಕೆ. ನಂತರ ಫಲಿತಾಂಶ.',
      description: 'IGr ಒಂದೇ ಸ್ಥಿರ ಮಾರ್ಗದ ಬದಲಿಗೆ ವೈಯಕ್ತಿಕ, ಸಕ್ರಿಯ ಮತ್ತು ಸ್ವಾವಲಂಬನೆ ಬೆಳೆಸುವ ಕಲಿಕಾ ಪಯಣವನ್ನು ನೀಡುತ್ತದೆ.',
      colTraditional: 'ಸಾಂಪ್ರದಾಯಿಕ ಕಲಿಕೆ',
      colIgr: 'IGr ಪದ್ಧತಿ',
      row1Trad: 'ಎಲ್ಲರಿಗೂ ಒಂದೇ ಸಿಲಬಸ್ ವೇಗ',
      row1Igr: 'ವೈಯಕ್ತಿಕ ಕಲಿಕಾ ಪಯಣ',
      row2Trad: 'ಬಾಯಿಪಾಠಕ್ಕೆ ಒತ್ತು',
      row2Igr: 'ಮೂಲ ಪರಿಕಲ್ಪನೆಗಳ ಮಾಸ್ಟರಿ',
      row3Trad: 'ನಿಷ್ಕ್ರಿಯ ಕಲಿಕೆ',
      row3Igr: 'ಗೇಮಿಫೈಡ್ ಸಕ್ರಿಯ ಕಲಿಕೆ',
      row4Trad: 'ಒಂದೇ ಬೋಧನಾ ಶೈಲಿ',
      row4Igr: 'ಹೊಂದಿಕೊಳ್ಳುವ ಹೊಂದಾಣಿಕೆಯ ಕಲಿಕೆ',
      row5Trad: 'ಹೆಚ್ಚಿನ ಸ್ಕ್ರೀನ್ ಸಮಯ',
      row5Igr: 'ಕಡಿಮೆ ಸಮಯದಲ್ಲಿ ಸ್ಮಾರ್ಟ್ ಕಲಿಕೆ',
      row6Trad: 'ಸೀಮಿತ AI ಪರಿಚಯ',
      row6Igr: 'ಸಹಜವಾಗಿಯೇ AI ಸನ್ನದ್ಧತೆ'
    },
    audienceSection: {
      eyebrow: '06 / ಶೈಕ್ಷಣಿಕ ಉತ್ಕೃಷ್ಟತೆಗಾಗಿ ನಿರ್ಮಿತ',
      title: 'ಟ್ಯೂಷನ್‌ಗಿಂತ ಮಿಗಿಲಾದದ್ದನ್ನು ಬಯಸುವ ಪ್ರತಿಯೊಂದು ಕುಟುಂಬಕ್ಕೆ.',
      card1Title: 'ಪೋಷಕರಿಗೆ',
      card1Desc: 'ಕಲಿಕೆ ಒತ್ತಡವಿಲ್ಲದೆ ವೈಯಕ್ತಿಕವಾಗಿರಬೇಕೆಂದು ಬಯಸುವವರಿಗೆ.',
      card2Title: 'ಕಲಿಕೆಯಲ್ಲಿ ಹಿಂದುಳಿದ ಮಕ್ಕಳಿಗೆ',
      card2Desc: 'ತಾಳ್ಮೆ ಮತ್ತು ಸ್ಪಷ್ಟತೆಯೊಂದಿಗೆ ಮೂಲ ಪರಿಕಲ್ಪನೆ ಕಲಿಯಬೇಕಾದವರಿಗೆ.',
      card3Title: 'ಉತ್ತಮ ಸಾಧಕರಿಗೆ',
      card3Desc: 'ಸಾಮಾನ್ಯ ಪಠ್ಯಕ್ಕಿಂತ ಮುಂದೆ ಸಾಗಲು ಸಿದ್ಧರಿರುವವರಿಗೆ.',
      card4Title: 'ಶಾಲೆಗಳಿಗೆ',
      card4Desc: 'ವಿದ್ಯಾರ್ಥಿಗಳನ್ನು AI ಯುಗಕ್ಕೆ ಸನ್ನದ್ಧಗೊಳಿಸಲು.'
    },
    finalCta: {
      eyebrow: 'ಒಂದು ಸಂಭಾಷಣೆಯೊಂದಿಗೆ ಆರಂಭಿಸಿ',
      titleLine1: 'ನಿಮ್ಮ ಮಗುವಿಗೆ ಅವರು ಅರ್ಹವಾದ ಕಲಿಕಾ ಪಯಣವನ್ನು ',
      titleLine2Em: 'ನೀಡಿ.',
      whatsappBtn: 'WhatsApp ನಲ್ಲಿ ಸಂಪರ್ಕಿಸಿ',
      bookCallBtn: 'ಉಚಿತ ಡಿಸ್ಕವರಿ ಕರೆ ಬುಕ್ ಮಾಡಿ',
      footerSummary: 'ಪ್ರತಿ ವಿದ್ಯಾರ್ಥಿಗೂ ಹೊಂದಿಕೊಳ್ಳುವ ಕಲಿಕೆ. AI ಶಕ್ತಿ. ಹೈಪರ್-ಪರ್ಸನಲೈಸೇಶನ್. ಶೈಕ್ಷಣಿಕ ಉತ್ಕೃಷ್ಟತೆಗಾಗಿ ನಿರ್ಮಿತ.',
      footerCopyright: '© IGr / ಇನ್‌ಸ್ಟಾಸ್ಕಿಲ್ಸ್ ಗೇಮ್‌ಚೇಂಜರ್'
    },
    modals: {
      videoTitle: 'IGr ಪ್ರಾಯೋಗಿಕ ವಿಡಿಯೋ ವೀಕ್ಷಿಸಿ',
      videoFooterDemo: 'ಅಧಿಕೃತ IGr ಡೆಮೊ',
      earlyAccessTitle: 'ಆರಂಭಿಕ ಪ್ರವೇಶಕ್ಕಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
      earlyAccessSubtitle: 'ಅಪ್ಪು ನಿಮ್ಮ ಮಗುವಿಗೆ CBSE ಕಲಿಕೆಯನ್ನು ಹೇಗೆ ಸುಲಭಗೊಳಿಸುತ್ತದೆ ಎಂಬುದನ್ನು ತಿಳಿಯಲು 1-on-1 ಉಚಿತ ಕರೆ ಬುಕ್ ಮಾಡಿ.',
      parentLabel: 'ಪೋಷಕರ / ಪಾಲಕರ ಹೆಸರು *',
      parentPlaceholder: 'ಉದಾ: ರಮೇಶ್ ಶರ್ಮಾ',
      studentLabel: 'ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು *',
      studentPlaceholder: 'ಉದಾ: ಆರವ್ ಶರ್ಮಾ',
      phoneLabel: 'WhatsApp ಸಂಖ್ಯೆ *',
      phonePlaceholder: '+91 98765 43210',
      classLabel: 'CBSE ತರಗತಿ *',
      emailLabel: 'ಇಮೇಲ್ ವಿಳಾಸ',
      emailPlaceholder: 'parent@example.com',
      submitBtn: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
      submittingBtn: 'ಅರ್ಜಿ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...',
      privacyBadge: '100% ಗೌಪ್ಯತೆ • ಶೂನ್ಯ ಸ್ಪ್ಯಾಮ್ ಭರವಸೆ',
      successTitle: 'ಅರ್ಜಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ!',
      successSub: '✓ ಯಶಸ್ವಿಯಾಗಿ ಕೌನ್ಸಿಲರ್ ವಿಭಾಗಕ್ಕೆ ಕಳುಹಿಸಲಾಗಿದೆ',
      successMsg: 'ಧನ್ಯವಾದಗಳು. ನಿಮ್ಮ ಉಚಿತ ಡಿಸ್ಕವರಿ ಕರೆಯನ್ನು ನಿಗದಿಪಡಿಸಲು ನಮ್ಮ ಶೈಕ್ಷಣಿಕ ಕೌನ್ಸಿಲರ್ ಶೀಘ್ರದಲ್ಲೇ ಸಂಪರ್ಕಿಸುತ್ತಾರೆ.',
      whatsappConnectBtn: 'WhatsApp ನಲ್ಲಿ ತಕ್ಷಣ ಸಂಪರ್ಕಿಸಿ',
      doneBtn: 'ಮುಗಿದಿದೆ',
      closeLabel: 'ವಿಂಡೋ ಮುಚ್ಚಿ'
    },
    appuChat: {
      headerTitle: 'ಅಪ್ಪು (APPU)',
      headerSubtitle: 'AI ಶೈಕ್ಷಣಿಕ ಮಾರ್ಗದರ್ಶಿ',
      dragTooltip: 'ಎಲ್ಲಿಗಾದರೂ ಡ್ರ್ಯಾಗ್ ಮಾಡಿ ಅಥವಾ ಅಪ್ಪು ಜೊತೆ ಮಾತನಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ',
      ariaToggle: 'ಅಪ್ಪು ಚಾಟ್ ತೆರೆಯಿರಿ',
      studentMode: '🎓 ವಿದ್ಯಾರ್ಥಿ ಮೋಡ್',
      parentMode: '🌿 ಪೋಷಕರ ಮೋಡ್',
      switchModeStudent: 'ಪೋಷಕರ ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸಿ',
      switchModeParent: 'ವಿದ್ಯಾರ್ಥಿ ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸಿ',
      muteVoice: 'ಧ್ವನಿ ಮ್ಯೂಟ್ ಮಾಡಿ',
      unmuteVoice: 'ಧ್ವನಿ ಆನ್ ಮಾಡಿ',
      voiceActive: 'ಧ್ವನಿ 🔊',
      voiceMuted: 'ಮ್ಯೂಟ್ 🔇',
      xpLabel: 'XP',
      streakLabel: 'ದಿನಗಳು',
      initialGreetingStudent: "ನಮಸ್ಕಾರ! 👋 ನಾನು **ಅಪ್ಪು**, CBSE 6 ರಿಂದ 12 ನೇ ತರಗತಿಯ ನಿಮ್ಮ AI ಶೈಕ್ಷಣಿಕ ಮಾರ್ಗದರ್ಶಿ! ನಿಮ್ಮ ಪಠ್ಯ, ಗಣಿತ ಸೂತ್ರಗಳು, ಭೌತಶಾಸ್ತ್ರದ ಕಾನ್ಸೆಪ್ಟ್ ಅಥವಾ ಪರೀಕ್ಷಾ ತಯಾರಿ ಬಗ್ಗೆ ಏನೇ ಕೇಳಿ! 🚀",
      initialGreetingParent: "ನಮಸ್ಕಾರ! 🌿 ನಾನು **ಅಪ್ಪು**, ನಿಮ್ಮ ಮಗುವಿನ 1-on-1 AI ಶೈಕ್ಷಣಿಕ ಮಾರ್ಗದರ್ಶಿ. ಮಗುವಿನ ಅಧ್ಯಯನ ಪ್ರಗತಿ ಅಥವಾ CBSE ಪಠ್ಯಕ್ರಮದ ಟ್ರ್ಯಾಕಿಂಗ್ ಬಗ್ಗೆ ನೀವು ನನ್ನನ್ನು ಕೇಳಬಹುದು.",
      placeholder: 'CBSE ಪರಿಕಲ್ಪನೆಗಳ ಬಗ್ಗೆ ಅಪ್ಪು ಬಳಿ ಕೇಳಿ...',
      sendLabel: 'ಸಂದೇಶ ಕಳುಹಿಸಿ',
      thinkingText: 'ಅಪ್ಪು ಪ್ರೀತಿಯಿಂದ ಯೋಚಿಸುತ್ತಿದ್ದಾನೆ... 💡',
      suggestedTitle: 'ಸೂಚಿಸಲಾದ ವಿಷಯಗಳು',
      suggestions: [
        '10ನೇ ತರಗತಿ ಬೆಳಕು ಮತ್ತು ದೃಗ್ವಿಜ್ಞಾನ',
        '9ನೇ ತರಗತಿ ಬಹುಪದೋಕ್ತಿಗಳು (Polynomials)',
        'WhatsApp ಗೆ ನೋಟ್ಸ್ ಕಳುಹಿಸಿ 📲',
        'ಅಧ್ಯಯನ ರಿಮೈಂಡರ್ ಸೆಟ್ ಮಾಡಿ 📅'
      ],
      errorNetwork: 'ಸಂಪರ್ಕದಲ್ಲಿ ಸಣ್ಣ ವ್ಯತ್ಯಯವಾಗಿದೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಮತ್ತೊಮ್ಮೆ ಕಳುಹಿಸಿ!',
      errorRateLimit: 'ಅತಿಥಿ ಸಂದೇಶ ಮಿತಿ ಮುಗಿದಿದೆ. ದಯವಿಟ್ಟು ಮುಂದುವರಿಯಲು ಡಿಸ್ಕವರಿ ಕರೆ ಬುಕ್ ಮಾಡಿ!',
      audioBlocked: 'ಆಡಿಯೋ ಪ್ಲೇಬ್ಯಾಕ್‌ನಲ್ಲಿ ಅಡಚಣೆಯಾಗಿದೆ. ನೀವು ಮೇಲಿನ ಉತ್ತರವನ್ನು ಓದಬಹುದು.',
      disclaimer: 'IGr APPU AI ಚಾಲಿತ • CBSE ಪಠ್ಯಕ್ರಮಕ್ಕೆ ಸುರಕ್ಷಿತ',
      whatsappRedirectMsg: 'WhatsApp ನಲ್ಲಿ ನೇರವಾಗಿ IGr ಜೊತೆ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ...',
      callRedirectMsg: 'CBSE ಕಲಿಕಾ ತಜ್ಞರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ. ಡಿಸ್ಕವರಿ ಕಾಲ್ ವಿಂಡೋ ತೆರೆಯಲಾಗುತ್ತಿದೆ...'
    }
  }
};
