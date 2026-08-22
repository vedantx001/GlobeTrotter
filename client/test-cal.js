const toDateString = (dateObj) => { const y = dateObj.getFullYear(); const m = String(dateObj.getMonth() + 1).padStart(2, '0'); const d = String(dateObj.getDate()).padStart(2, '0'); return `${y}-${m}-${d}`; }; 
const generateMonthGrid = (year, month) => { 
  const firstDay = new Date(year, month, 1); 
  const lastDay = new Date(year, month + 1, 0); 
  const startDate = new Date(firstDay); 
  startDate.setDate(startDate.getDate() - startDate.getDay()); 
  const endDate = new Date(lastDay); 
  if (endDate.getDay() !== 6) { 
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); 
  } 
  const grid = []; 
  let currentWeek = []; 
  const iterDate = new Date(startDate); 
  iterDate.setHours(12, 0, 0, 0); // test time issues
  endDate.setHours(23, 59, 59, 999);
  while (iterDate <= endDate) { 
    currentWeek.push({ 
      dateString: toDateString(iterDate), 
      dayOfMonth: iterDate.getDate() 
    }); 
    if (currentWeek.length === 7) { 
      grid.push(currentWeek); 
      currentWeek = []; 
    } 
    iterDate.setDate(iterDate.getDate() + 1); 
  } 
  return grid; 
}; 
console.log(JSON.stringify(generateMonthGrid(2026, 8), null, 2));
