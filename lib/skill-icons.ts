import { IconType } from 'react-icons'
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiHtml5,
  SiCss,
  SiFigma,
  SiCplusplus,
  SiPython,
  SiNodedotjs,
  SiExpress,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiFirebase,
  SiRedis,
  SiPostman,
  SiTensorflow,
  SiPytorch,
  SiScikitlearn,
  SiOpencv,
  SiLangchain,
  SiDocker,
  SiKubernetes,
  SiVercel,
  SiNetlify,
  SiGit,
  SiGithub,
  SiArduino,
  SiAndroid,
  SiExpo,
  SiJest,
} from 'react-icons/si'
import { FaAws, FaMicrochip, FaPlug, FaPalette } from 'react-icons/fa'
import { Code2, Terminal, Database, Brain, Cloud, Wrench, Smartphone } from 'lucide-react'

export const techIconMap: Record<string, IconType> = {
  'JavaScript': SiJavascript,
  'TypeScript': SiTypescript,
  'React': SiReact,
  'React Native': SiReact,
  'Expo': SiExpo,
  'Android': SiAndroid,
  'Next.js': SiNextdotjs,
  'Tailwind CSS': SiTailwindcss,
  'HTML5': SiHtml5,
  'CSS3': SiCss,
  'Figma': SiFigma,
  'C / C++': SiCplusplus,
  'Python': SiPython,
  'Node.js': SiNodedotjs,
  'Express.js': SiExpress,
  'Linux': SiLinux,
  'MongoDB': SiMongodb,
  'MySQL': SiMysql,
  'Firebase': SiFirebase,
  'Redis': SiRedis,
  'Postman': SiPostman,
  'TensorFlow': SiTensorflow,
  'PyTorch': SiPytorch,
  'Scikit-learn': SiScikitlearn,
  'OpenCV': SiOpencv,
  'LangChain': SiLangchain,
  'Docker': SiDocker,
  'Kubernetes': SiKubernetes,
  'Vercel': SiVercel,
  'Netlify': SiNetlify,
  'Git': SiGit,
  'GitHub': SiGithub,
  'Arduino': SiArduino,
  'Jest': SiJest,
  'AWS': FaAws,
  'MicroPython': FaMicrochip,
  'Embedded C++': FaMicrochip,
  'API Testing': FaPlug,
  'UI Design': FaPalette,
}

export function techIcon(name: string): IconType | undefined {
  return techIconMap[name]
}

type CategoryIconEntry = { icon: typeof Code2; label: string }

export const categoryIconMap: Record<string, CategoryIconEntry> = {
  code2: { icon: Code2, label: 'Frontend' },
  terminal: { icon: Terminal, label: 'Programming' },
  database: { icon: Database, label: 'Database' },
  brain: { icon: Brain, label: 'AI / ML' },
  cloud: { icon: Cloud, label: 'Cloud' },
  wrench: { icon: Wrench, label: 'Tools' },
  smartphone: { icon: Smartphone, label: 'Mobile' },
}

export function categoryIcon(key: string): typeof Code2 {
  return categoryIconMap[key]?.icon ?? Code2
}
