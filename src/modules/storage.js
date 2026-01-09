/**
 * Módulo de Armazenamento Local
 * Gerencia todas as operações de persistência de dados usando localStorage
 */

const STORAGE_KEY = 'habitos-diarios-data';
const THEME_KEY = 'habitos-diarios-theme';

/**
 * Salva os dados dos hábitos no localStorage
 * @param {Object} data - Dados dos hábitos a serem salvos
 */
export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    throw new Error('Não foi possível salvar os dados. Armazenamento pode estar cheio.');
  }
}

/**
 * Carrega os dados dos hábitos do localStorage
 * @returns {Object} Dados dos hábitos ou estrutura padrão
 */
export function loadData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Retorna estrutura padrão se não houver dados
      return {
        habits: [],
        history: {} // Formato: { "YYYY-MM-DD": { habitId: true/false } }
      };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return {
      habits: [],
      history: {}
    };
  }
}

/**
 * Salva o tema preferido do usuário
 * @param {string} theme - 'light' ou 'dark'
 */
export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Erro ao salvar tema:', error);
  }
}

/**
 * Carrega o tema preferido do usuário
 * @returns {string} 'light' ou 'dark'
 */
export function loadTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'light';
  } catch (error) {
    console.error('Erro ao carregar tema:', error);
    return 'light';
  }
}

/**
 * Limpa todos os dados armazenados (útil para reset)
 */
export function clearAllData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(THEME_KEY);
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
  }
}

/**
 * Obtém o histórico de um hábito específico
 * @param {string} habitId - ID do hábito
 * @param {Object} history - Objeto de histórico completo
 * @returns {Object} Histórico do hábito formatado por data
 */
export function getHabitHistory(habitId, history) {
  const habitHistory = {};
  
  for (const [date, habits] of Object.entries(history)) {
    if (habits[habitId] !== undefined) {
      habitHistory[date] = habits[habitId];
    }
  }
  
  return habitHistory;
}

/**
 * Verifica se há espaço suficiente no localStorage
 * @returns {boolean} true se há espaço, false caso contrário
 */
export function checkStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

