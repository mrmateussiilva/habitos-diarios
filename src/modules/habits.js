/**
 * Módulo de Lógica de Hábitos
 * Contém toda a lógica de negócio relacionada aos hábitos
 */

import { loadData, saveData, getHabitHistory } from './storage.js';

/**
 * Gera um ID único para um hábito
 * @returns {string} ID único
 */
function generateId() {
  return `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Obtém a data atual no formato YYYY-MM-DD
 * @returns {string} Data formatada
 */
export function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Obtém a data de ontem
 * @returns {string} Data formatada
 */
export function getYesterdayDate() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

/**
 * Obtém todos os hábitos
 * @returns {Array} Lista de hábitos
 */
export function getAllHabits() {
  const data = loadData();
  return data.habits || [];
}

/**
 * Cria um novo hábito
 * @param {string} name - Nome do hábito
 * @param {string} emoji - Emoji/ícone do hábito
 * @param {string} color - Cor do hábito
 * @returns {Object} Hábito criado
 */
export function createHabit(name, emoji, color) {
  const data = loadData();
  const habit = {
    id: generateId(),
    name: name.trim(),
    emoji: emoji.trim(),
    color: color,
    createdAt: getCurrentDate()
  };
  
  data.habits.push(habit);
  saveData(data);
  
  return habit;
}

/**
 * Atualiza um hábito existente
 * @param {string} id - ID do hábito
 * @param {Object} updates - Objeto com campos a atualizar
 * @returns {Object|null} Hábito atualizado ou null se não encontrado
 */
export function updateHabit(id, updates) {
  const data = loadData();
  const habitIndex = data.habits.findIndex(h => h.id === id);
  
  if (habitIndex === -1) {
    return null;
  }
  
  data.habits[habitIndex] = {
    ...data.habits[habitIndex],
    ...updates
  };
  
  saveData(data);
  return data.habits[habitIndex];
}

/**
 * Deleta um hábito
 * @param {string} id - ID do hábito
 * @returns {boolean} true se deletado com sucesso
 */
export function deleteHabit(id) {
  const data = loadData();
  const habitIndex = data.habits.findIndex(h => h.id === id);
  
  if (habitIndex === -1) {
    return false;
  }
  
  data.habits.splice(habitIndex, 1);
  
  // Remove o hábito do histórico
  for (const date in data.history) {
    if (data.history[date][id] !== undefined) {
      delete data.history[date][id];
    }
  }
  
  saveData(data);
  return true;
}

/**
 * Marca um hábito como completo ou incompleto para o dia atual
 * @param {string} habitId - ID do hábito
 * @param {boolean} completed - true para completo, false para incompleto
 */
export function toggleHabitCompletion(habitId, completed) {
  const data = loadData();
  const today = getCurrentDate();
  
  if (!data.history[today]) {
    data.history[today] = {};
  }
  
  data.history[today][habitId] = completed;
  saveData(data);
}

/**
 * Verifica se um hábito está completo hoje
 * @param {string} habitId - ID do hábito
 * @returns {boolean} true se completo
 */
export function isHabitCompletedToday(habitId) {
  const data = loadData();
  const today = getCurrentDate();
  
  return data.history[today]?.[habitId] === true;
}

/**
 * Calcula o streak (sequência consecutiva) de um hábito
 * @param {string} habitId - ID do hábito
 * @returns {number} Número de dias consecutivos
 */
export function calculateStreak(habitId) {
  const data = loadData();
  const history = getHabitHistory(habitId, data.history);
  
  if (Object.keys(history).length === 0) {
    return 0;
  }
  
  // Ordena as datas
  const dates = Object.keys(history).sort((a, b) => new Date(b) - new Date(a));
  
  let streak = 0;
  let currentDate = new Date(getCurrentDate());
  
  // Se não completou hoje, verifica se completou ontem
  if (!isHabitCompletedToday(habitId)) {
    currentDate = new Date(getYesterdayDate());
  }
  
  for (let i = 0; i < dates.length; i++) {
    const date = new Date(dates[i]);
    const expectedDate = new Date(currentDate);
    expectedDate.setDate(expectedDate.getDate() - i);
    
    // Compara apenas a data (sem hora)
    if (date.toDateString() === expectedDate.toDateString() && history[dates[i]]) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Calcula a taxa de conclusão de hoje
 * @returns {number} Porcentagem de conclusão (0-100)
 */
export function getTodayCompletionRate() {
  const habits = getAllHabits();
  if (habits.length === 0) {
    return 0;
  }
  
  const completed = habits.filter(h => isHabitCompletedToday(h.id)).length;
  return Math.round((completed / habits.length) * 100);
}

/**
 * Obtém o melhor streak de todos os hábitos
 * @returns {number} Maior streak
 */
export function getBestStreak() {
  const habits = getAllHabits();
  if (habits.length === 0) {
    return 0;
  }
  
  return Math.max(...habits.map(h => calculateStreak(h.id)), 0);
}

/**
 * Calcula o total de dias desde o primeiro hábito criado
 * @returns {number} Total de dias
 */
export function getTotalDays() {
  const habits = getAllHabits();
  if (habits.length === 0) {
    return 0;
  }
  
  const firstHabit = habits.reduce((oldest, habit) => {
    return habit.createdAt < oldest.createdAt ? habit : oldest;
  });
  
  if (!firstHabit.createdAt) {
    return 0;
  }
  
  const startDate = new Date(firstHabit.createdAt);
  const today = new Date(getCurrentDate());
  const diffTime = Math.abs(today - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays + 1; // +1 para incluir o dia atual
}

/**
 * Obtém o histórico de um mês específico
 * @param {number} year - Ano
 * @param {number} month - Mês (0-11)
 * @returns {Object} Histórico do mês formatado
 */
export function getMonthHistory(year, month) {
  const data = loadData();
  const monthHistory = {};
  
  // Percorre todos os dias do mês
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = date.toISOString().split('T')[0];
    
    if (data.history[dateString]) {
      monthHistory[dateString] = data.history[dateString];
    }
  }
  
  return monthHistory;
}

/**
 * Inicializa dados padrão com hábitos de exemplo
 */
export function initializeDefaultHabits() {
  const data = loadData();
  
  if (data.habits.length === 0) {
    createHabit('Beber 2L de água', '💧', '#06b6d4');
    createHabit('Ler 30 minutos', '📚', '#8b5cf6');
    createHabit('Exercício físico', '🏃', '#10b981');
  }
}

/**
 * Reseta os hábitos do dia anterior se for um novo dia
 * Esta função é chamada periodicamente para garantir que a data está atualizada
 */
export function checkAndResetDay() {
  const data = loadData();
  const today = getCurrentDate();
  const lastCheck = localStorage.getItem('last-date-check');
  
  // Se mudou o dia e não é a primeira vez
  if (lastCheck && lastCheck !== today) {
    // Não precisamos resetar nada, apenas atualizar a última verificação
    // O histórico é mantido para visualização
  }
  
  localStorage.setItem('last-date-check', today);
}

