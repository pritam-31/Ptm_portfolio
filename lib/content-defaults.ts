import { SiteContent } from '@/types'

export const defaultContent: SiteContent = {
  hero: {
    badge: 'Electronics & Communication Engineering Undergraduate',
    greeting: 'Hey, I\u2019m',
    name: 'Pritam Padhan',
    titleLine1: 'BUILDING THE',
    titleAccent: 'FUTURE WITH CODE',
    description:
      'I\u2019m Pritam Padhan, a full-stack and mobile app developer and AI enthusiast building intelligent full-stack and mobile applications with React, React Native, Python, Node.js, and modern AI tooling.',
  },
  about: {
    badge: 'About Me',
    heading: 'Building With',
    headingAccent: 'Purpose & Curiosity',
    paragraph1:
      'I am Pritam Padhan, an Electronics & Communication Engineering undergraduate at GIET Bhubaneswar with a strong interest in AI, full-stack development, and dependable software engineering.',
    paragraph2:
      'From a biomedical AI assistant at NIT Raipur to production-grade MERN features, I enjoy owning projects end-to-end — from requirements and implementation through testing, debugging, and delivery.',
    stats: [
      { icon: 'award', number: '8.95', label: 'CGPA / 10' },
      { icon: 'rocket', number: '02', label: 'Internships' },
      { icon: 'globe', number: '04', label: 'Featured Projects' },
      { icon: 'clock', number: '2028', label: 'Graduation Target' },
    ],
    values: [
      { icon: 'target', title: 'AI & Research', description: 'Biomedical AI, Gemma fine-tuning, vision-language models, and data processing.' },
      { icon: 'users', title: 'Full-Stack Delivery', description: 'End-to-end MERN features, REST APIs, authentication, databases, and deployment.' },
      { icon: 'shield', title: 'Strong Foundations', description: 'DSA in C++, OOP, RDBMS, operating systems, complexity analysis, and SDLC.' },
      { icon: 'trending', title: 'Always Learning', description: 'Google AI Agents Intensive, AWS Solutions Architecture, and hands-on building.' },
    ],
  },
  cta: {
    badge: 'Open to Software & Engineering Internships',
    heading: 'Let\u2019s Build Something',
    headingAccent: 'Meaningful Together',
    paragraph:
      'I\u2019m looking for opportunities to own modules, learn from strong engineering teams, and build products that make a real difference.',
    stats: ['CGPA 8.95 / 10', 'MERN + React Native + AI', 'Jharsuguda, Odisha'],
  },
  contact: {
    email: 'pritampadhan3107@gmail.com',
    phone: '+91 6372516197',
    phoneRaw: '+916372516197',
    location: 'Jharsuguda, Odisha',
  },
  footer: {
    tagline:
      'Electronics & Communication Engineering undergraduate building AI products and full-stack web experiences.',
  },
}