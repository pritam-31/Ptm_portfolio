import { Award, Clock, Globe, Rocket, ShieldCheck, Sparkles, Target, TrendingUp, Users } from 'lucide-react'

const iconMap = {
  award: Award,
  rocket: Rocket,
  globe: Globe,
  clock: Clock,
  target: Target,
  users: Users,
  shield: ShieldCheck,
  trending: TrendingUp,
}

export const contentIconKeys = Object.keys(iconMap)

export function contentIcon(key?: string) {
  return (key && iconMap[key as keyof typeof iconMap]) || Sparkles
}