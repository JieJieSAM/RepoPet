import type { PersonaType } from "./entities/PersonaProfile.js";

export const personaTitleByType: Record<PersonaType, string> = {
  order_keeper: "秩序维护者",
  late_night_grinder: "深夜爆肝饲养员",
  bugfix_hero: "热修补大师",
  hibernation_keeper: "仓库冬眠管理员",
  split_brain_zookeeper: "多线程人格分裂兽"
};
