import Colors from '@/constants/Colors'

export interface IQuestonLevelAndColor {
	levelTitle: string
	levelBgColor: string
}

export const getLevelColor = (level?: string | undefined) => {
  if (typeof level !== 'string') {
    // Обрабатываем случай, когда level не определен или не является строкой
    console.error('Invalid input for getLevelColor:', level);
    return 'rgb(0, 0, 0)'; // Возвращаем какое-то дефолтное значение, например черный цвет
  }

  const newString: string[] = level.split(',');
  const [r, g, b] = newString;

  const color = `rgb(${r}, ${g}, ${b})`;
  return color;
}


export const getTextColor = (bgColor: string): string => {
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#333" : "#FFF";
};
