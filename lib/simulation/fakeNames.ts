import type { Locale } from '../types';

/**
 * Pool of fake names by locale for simulation
 */
export const FAKE_NAMES: Record<Locale, string[]> = {
  es: [
    'María', 'Carlos', 'Ana', 'José', 'Laura', 'Miguel', 'Carmen', 'Antonio',
    'Isabel', 'Francisco', 'Rosa', 'Manuel', 'Lucía', 'David', 'Marta', 'Juan',
    'Elena', 'Pedro', 'Sara', 'Javier', 'Paula', 'Alejandro', 'Cristina', 'Roberto'
  ],
  en: [
    'Emma', 'James', 'Sophie', 'Oliver', 'Charlotte', 'Harry', 'Lily', 'George',
    'Emily', 'Thomas', 'Grace', 'William', 'Olivia', 'Jack', 'Jessica', 'Noah',
    'Mia', 'Alexander', 'Chloe', 'Daniel', 'Hannah', 'Matthew', 'Sophia', 'David'
  ],
  zh: [
    '李伟', '王芳', '张明', '刘洋', '陈雪', '杨帆', '赵静', '周斌',
    '吴敏', '郑强', '孙丽', '马超', '朱婷', '胡军', '林霞', '何刚',
    '罗梅', '梁鹏', '宋云', '谢磊', '韩冰', '唐波', '许琳', '邓飞'
  ],
  pt: [
    'Maria', 'João', 'Ana', 'Pedro', 'Catarina', 'Miguel', 'Sofia', 'André',
    'Inês', 'Ricardo', 'Beatriz', 'Carlos', 'Teresa', 'Fernando', 'Mariana', 'Rui',
    'Clara', 'Bruno', 'Marta', 'Diogo', 'Leonor', 'Tiago', 'Francisca', 'Hugo'
  ],
  fr: [
    'Marie', 'Louis', 'Camille', 'Thomas', 'Léa', 'Nicolas', 'Emma', 'Pierre',
    'Sophie', 'Alexandre', 'Julie', 'François', 'Charlotte', 'Jean', 'Pauline', 'Lucas',
    'Manon', 'Antoine', 'Chloé', 'Hugo', 'Laura', 'Gabriel', 'Sarah', 'Maxime'
  ],
};

/**
 * Gets a random name from the pool for a given locale
 * @param locale - The locale to use
 * @returns A random name
 */
export function getRandomName(locale: Locale = 'es'): string {
  const names = FAKE_NAMES[locale] || FAKE_NAMES.es;
  return names[Math.floor(Math.random() * names.length)];
}
