/**
 * Módulo de Interface do Usuário
 * Responsável por toda a manipulação do DOM e renderização visual
 */

import {
  getAllHabits,
  toggleHabitCompletion,
  isHabitCompletedToday,
  calculateStreak,
  getTodayCompletionRate,
  getBestStreak,
  getTotalDays,
  getMonthHistory,
  getCurrentDate,
  deleteHabit
} from './habits.js';

/**
 * Exibe uma notificação toast na tela
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo: 'success', 'error', 'info'
 */
export function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/**
 * Renderiza a lista de hábitos
 */
export function renderHabits() {
  const habits = getAllHabits();
  const habitsList = document.getElementById('habitsList');
  
  if (habits.length === 0) {
    habitsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <p>Nenhum hábito cadastrado ainda.</p>
        <p class="empty-hint">Clique em "Adicionar" para começar!</p>
      </div>
    `;
    return;
  }
  
  habitsList.innerHTML = habits.map(habit => {
    const completed = isHabitCompletedToday(habit.id);
    const streak = calculateStreak(habit.id);
    
    return `
      <div class="habit-card ${completed ? 'completed' : ''}" data-habit-id="${habit.id}">
        <div class="habit-header">
          <div class="habit-info">
            <span class="habit-emoji" style="background: ${habit.color}20; border-color: ${habit.color}">
              ${habit.emoji}
            </span>
            <div class="habit-details">
              <h3 class="habit-name">${escapeHtml(habit.name)}</h3>
              <div class="habit-streak">
                🔥 Streak: ${streak} ${streak === 1 ? 'dia' : 'dias'}
              </div>
            </div>
          </div>
          <button class="habit-toggle ${completed ? 'active' : ''}" 
                  data-habit-id="${habit.id}"
                  aria-label="Marcar ${escapeHtml(habit.name)} como ${completed ? 'incompleto' : 'completo'}">
            <span class="check-icon">${completed ? '✓' : ''}</span>
          </button>
        </div>
        <div class="habit-actions">
          <button class="btn-icon edit-habit" data-habit-id="${habit.id}" title="Editar">
            ✏️
          </button>
          <button class="btn-icon delete-habit" data-habit-id="${habit.id}" title="Excluir">
            🗑️
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  // Adiciona event listeners aos botões
  attachHabitListeners();
}

/**
 * Anexa event listeners aos hábitos renderizados
 */
function attachHabitListeners() {
  // Botões de toggle (completar/incompletar)
  document.querySelectorAll('.habit-toggle').forEach(button => {
    button.addEventListener('click', (e) => {
      const habitId = e.currentTarget.dataset.habitId;
      const completed = !isHabitCompletedToday(habitId);
      
      toggleHabitCompletion(habitId, completed);
      renderHabits();
      renderStats();
      renderCalendar();
      
      const habit = getAllHabits().find(h => h.id === habitId);
      showToast(
        completed 
          ? `Parabéns! ${habit.name} marcado como completo! 🎉`
          : `${habit.name} marcado como incompleto.`,
        completed ? 'success' : 'info'
      );
    });
  });
  
  // Botões de editar
  document.querySelectorAll('.edit-habit').forEach(button => {
    button.addEventListener('click', (e) => {
      const habitId = e.currentTarget.dataset.habitId;
      openEditModal(habitId);
    });
  });
  
  // Botões de deletar
  document.querySelectorAll('.delete-habit').forEach(button => {
    button.addEventListener('click', (e) => {
      const habitId = e.currentTarget.dataset.habitId;
      deleteHabitHandler(habitId);
    });
  });
}

/**
 * Abre o modal para editar um hábito
 * @param {string} habitId - ID do hábito
 */
export function openEditModal(habitId) {
  const habits = getAllHabits();
  const habit = habits.find(h => h.id === habitId);
  
  if (!habit) {
    return;
  }
  
  document.getElementById('modalTitle').textContent = 'Editar Hábito';
  document.getElementById('habitId').value = habit.id;
  document.getElementById('habitName').value = habit.name;
  document.getElementById('habitEmoji').value = habit.emoji;
  document.getElementById('habitColor').value = habit.color;
  document.getElementById('deleteBtn').style.display = 'block';
  
  openModal();
}

/**
 * Abre o modal para adicionar um novo hábito
 */
export function openAddModal() {
  document.getElementById('modalTitle').textContent = 'Adicionar Hábito';
  document.getElementById('habitForm').reset();
  document.getElementById('habitId').value = '';
  document.getElementById('habitColor').value = '#6366f1';
  document.getElementById('deleteBtn').style.display = 'none';
  
  openModal();
}

/**
 * Abre o modal
 */
function openModal() {
  const modal = document.getElementById('habitModal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  // Foca no primeiro input
  setTimeout(() => {
    document.getElementById('habitName').focus();
  }, 100);
}

/**
 * Fecha o modal
 */
export function closeModal() {
  const modal = document.getElementById('habitModal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
  document.getElementById('habitForm').reset();
}

/**
 * Handler para deletar um hábito
 * @param {string} habitId - ID do hábito
 */
function deleteHabitHandler(habitId) {
  const habit = getAllHabits().find(h => h.id === habitId);
  
  if (!habit) {
    return;
  }
  
  if (confirm(`Tem certeza que deseja excluir o hábito "${habit.name}"?`)) {
    deleteHabit(habitId);
    renderHabits();
    renderStats();
    renderCalendar();
    showToast(`Hábito "${habit.name}" excluído.`, 'info');
    closeModal();
  }
}

/**
 * Renderiza as estatísticas na barra superior
 */
export function renderStats() {
  const completionRate = getTodayCompletionRate();
  const bestStreak = getBestStreak();
  const totalDays = getTotalDays();
  
  document.getElementById('todayCompletion').textContent = `${completionRate}%`;
  document.getElementById('bestStreak').textContent = bestStreak;
  document.getElementById('totalDays').textContent = totalDays;
}

/**
 * Renderiza o calendário do mês atual
 */
export function renderCalendar() {
  const calendar = document.getElementById('calendar');
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const today = getCurrentDate();
  
  const monthHistory = getMonthHistory(currentYear, currentMonth);
  const habits = getAllHabits();
  
  // Cabeçalho do calendário
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  let html = `
    <div class="calendar-header">
      <h3>${monthNames[currentMonth]} ${currentYear}</h3>
    </div>
    <div class="calendar-grid">
      <div class="calendar-weekdays">
        <div>Dom</div>
        <div>Seg</div>
        <div>Ter</div>
        <div>Qua</div>
        <div>Qui</div>
        <div>Sex</div>
        <div>Sáb</div>
      </div>
      <div class="calendar-days">
  `;
  
  // Primeiro dia do mês
  const firstDay = new Date(currentYear, currentMonth, 1);
  const startingDayOfWeek = firstDay.getDay();
  
  // Preenche dias vazios antes do primeiro dia
  for (let i = 0; i < startingDayOfWeek; i++) {
    html += '<div class="calendar-day empty"></div>';
  }
  
  // Dias do mês
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dateString = date.toISOString().split('T')[0];
    const isToday = dateString === today;
    const dayData = monthHistory[dateString];
    
    // Calcula quantos hábitos foram completados neste dia
    let completedCount = 0;
    if (dayData) {
      completedCount = habits.filter(h => dayData[h.id] === true).length;
    }
    
    const totalHabits = habits.length;
    const completionRate = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;
    
    // Determina a classe baseada na taxa de conclusão
    let dayClass = 'calendar-day';
    if (isToday) dayClass += ' today';
    if (completionRate === 100) dayClass += ' perfect';
    else if (completionRate >= 50) dayClass += ' good';
    else if (completionRate > 0) dayClass += ' partial';
    else dayClass += ' empty-day';
    
    html += `
      <div class="${dayClass}" title="${dateString}: ${completedCount}/${totalHabits} hábitos completos">
        <span class="day-number">${day}</span>
        ${isToday ? '<span class="today-indicator">Hoje</span>' : ''}
      </div>
    `;
  }
  
  html += `
      </div>
    </div>
    <div class="calendar-legend">
      <div class="legend-item">
        <span class="legend-color perfect"></span>
        <span>100%</span>
      </div>
      <div class="legend-item">
        <span class="legend-color good"></span>
        <span>50%+</span>
      </div>
      <div class="legend-item">
        <span class="legend-color partial"></span>
        <span>1-49%</span>
      </div>
      <div class="legend-item">
        <span class="legend-color empty-day"></span>
        <span>0%</span>
      </div>
    </div>
  `;
  
  calendar.innerHTML = html;
}

/**
 * Aplica o tema claro ou escuro
 * @param {string} theme - 'light' ou 'dark'
 */
export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  
  const themeIcon = document.querySelector('.theme-icon');
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

/**
 * Escapa HTML para prevenir XSS
 * @param {string} text - Texto a ser escapado
 * @returns {string} Texto escapado
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

