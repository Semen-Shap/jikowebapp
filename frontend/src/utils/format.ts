export const formatDate = (deadline: string) => {
  if (!deadline) return null;

  const dateObj = new Date(deadline);
  const day = dateObj.getDate();
  const monthIndex = dateObj.getMonth();

  const months = [
    'января', 'февраля', 'марта', 'апреля',
    'мая', 'июня', 'июля', 'августа',
    'сентября', 'октября', 'ноября', 'декабря'
  ];

  const monthName = months[monthIndex];

  // Проверяем, содержит ли deadline информацию о времени
  const hasTime = deadline.includes('T') && deadline.includes(':');

  if (!hasTime) {
    // Если времени нет, возвращаем только дату
    return `${day} ${monthName}`;
  }

  // Если время есть, форматируем полную дату со временем
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');

  // Получаем смещение часового пояса в минутах
  const timezoneOffset = dateObj.getTimezoneOffset();
  const timezoneHours = Math.abs(Math.floor(timezoneOffset / 60));
  const timezoneMinutes = Math.abs(timezoneOffset % 60);

  // Форматируем часовой пояс
  const timezoneString = `${timezoneOffset > 0 ? '-' : '+'}${timezoneHours.toString().padStart(2, '0')}:${timezoneMinutes.toString().padStart(2, '0')}`;

  return `${day} ${monthName}, ${hours}:${minutes} (GMT${timezoneString})`;
};