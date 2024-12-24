import { clsx, type ClassValue } from "clsx"
import { differenceInCalendarDays, format } from "date-fns";
import { zhCN } from "date-fns/locale";

import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateOrDaysAgo(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  const daysDifference = differenceInCalendarDays(today, date);

  if (daysDifference < 0) {
    // 如果日期在未来，则直接返回日期
    return format(date, 'yyyy年MM月dd日');
  }

  if (daysDifference <= 7) {
    // 如果日期在7天以内（包括今天），显示几天前
    if (daysDifference === 0) {
      return '今天';
    }
    return `${daysDifference} 天前`;
  }

  // 如果日期超过7天，显示具体日期
  return format(date, 'yyyy年MM月dd日EEEE', { locale: zhCN });
}