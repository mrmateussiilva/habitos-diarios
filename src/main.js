/**
 * Arquivo Principal da Aplicação
 * Ponto de entrada e coordenação de todos os módulos
 */

import { 
  getAllHabits, 
  createHabit, 
  updateHabit, 
  deleteHabit,
  initializeDefaultHabits,
  checkAndResetDay
} from './modules/habits.js';

import {
  renderHabits,
  renderStats,
  renderCalendar,
  openAddModal,
  openEditModal,
  closeModal,
  showToast,
  applyTheme
} from './modules/ui.js';

import { saveTheme, loadTheme } from './modules/storage.js';

/**
 * Inicializa a aplicação
 */
function init() {
  // Inicializa hábitos padrão se não houver nenhum
  initializeDefaultHabits();
  
  // Verifica e reseta o dia se necessário
  checkAndResetDay();
  
  // Aplica o tema salvo
  const savedTheme = loadTheme();
  applyTheme(savedTheme);
  
  // Renderiza a interface
  renderHabits();
  renderStats();
  renderCalendar();
  
  // Configura event listeners
  setupEventListeners();
  
  // Registra service worker (PWA)
  registerServiceWorker();
  
  // Verifica periodicamente se mudou o dia
  setInterval(checkAndResetDay, 60000); // A cada minuto
}

/**
 * Configura todos os event listeners da aplicação
 */
function setupEventListeners() {
  // Botão de adicionar hábito
  const addHabitBtn = document.getElementById('addHabitBtn');
  addHabitBtn.addEventListener('click', () => {
    openAddModal();
  });
  
  // Formulário de hábito
  const habitForm = document.getElementById('habitForm');
  habitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit();
  });
  
  // Botão de cancelar
  const cancelBtn = document.getElementById('cancelBtn');
  cancelBtn.addEventListener('click', () => {
    closeModal();
  });
  
  // Botão de fechar modal
  const modalClose = document.getElementById('modalClose');
  modalClose.addEventListener('click', () => {
    closeModal();
  });
  
  // Fechar modal ao clicar fora
  const modal = document.getElementById('habitModal');
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Botão de deletar
  const deleteBtn = document.getElementById('deleteBtn');
  deleteBtn.addEventListener('click', () => {
    const habitId = document.getElementById('habitId').value;
    if (habitId) {
      const habit = getAllHabits().find(h => h.id === habitId);
      if (habit && confirm(`Tem certeza que deseja excluir o hábito "${habit.name}"?`)) {
        deleteHabit(habitId);
        renderHabits();
        renderStats();
        renderCalendar();
        showToast(`Hábito "${habit.name}" excluído.`, 'info');
        closeModal();
      }
    }
  });
  
  // Toggle de tema
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    saveTheme(newTheme);
  });
  
  // Presets de cor
  document.querySelectorAll('.color-preset').forEach(button => {
    button.addEventListener('click', (e) => {
      const color = e.currentTarget.dataset.color;
      document.getElementById('habitColor').value = color;
    });
  });
  
  // Fechar modal com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

/**
 * Processa o submit do formulário de hábito
 */
function handleFormSubmit() {
  const habitId = document.getElementById('habitId').value;
  const name = document.getElementById('habitName').value.trim();
  const emoji = document.getElementById('habitEmoji').value.trim();
  const color = document.getElementById('habitColor').value;
  
  if (!name || !emoji) {
    showToast('Por favor, preencha todos os campos.', 'error');
    return;
  }
  
  if (habitId) {
    // Editar hábito existente
    const updated = updateHabit(habitId, { name, emoji, color });
    if (updated) {
      showToast(`Hábito "${name}" atualizado com sucesso!`, 'success');
      renderHabits();
      renderStats();
      closeModal();
    } else {
      showToast('Erro ao atualizar hábito.', 'error');
    }
  } else {
    // Criar novo hábito
    const habit = createHabit(name, emoji, color);
    showToast(`Hábito "${name}" criado com sucesso! 🎉`, 'success');
    renderHabits();
    renderStats();
    renderCalendar();
    closeModal();
  }
}

/**
 * Registra o Service Worker para funcionalidade PWA
 * O Vite Plugin PWA registra automaticamente o service worker,
 * mas este código pode ser usado para verificação manual se necessário
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    // O Vite Plugin PWA gerencia o service worker automaticamente
    // Este código é apenas para debug/logs
    window.addEventListener('load', () => {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        if (registrations.length > 0) {
          console.log('Service Worker registrado:', registrations[0].scope);
          
          // Listener para quando uma nova versão estiver disponível
          registrations[0].addEventListener('updatefound', () => {
            console.log('Nova versão do Service Worker encontrada');
          });
        }
      }).catch((error) => {
        console.log('Erro ao verificar Service Worker:', error);
      });
      
      // Listener para quando uma nova versão estiver disponível
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker atualizado, recarregando página...');
        // window.location.reload(); // Descomente se quiser reload automático
      });
    });
  }
}

// Inicializa a aplicação quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

