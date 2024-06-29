export const formatDate = (deadline: string) => {

  if (!deadline) return null;
  
  const dateObj = new Date(deadline); // Преобразуем строку в объект Date
  const day = dateObj.getDate(); // Получаем число месяца
  const monthIndex = dateObj.getMonth(); // Получаем индекс месяца (0 - январь, 11 - декабрь)

  // Массив с названиями месяцев
  const months = [
    'января', 'февраля', 'марта', 'апреля',
    'мая', 'июня', 'июля', 'августа',
    'сентября', 'октября', 'ноября', 'декабря'
  ];

  const monthName = months[monthIndex]; // Получаем название месяца по индексу

  // Возвращаем строку для отображения числа и названия месяца
  return `${day} ${monthName}`;
};