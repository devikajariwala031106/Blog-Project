document.addEventListener('DOMContentLoaded', function () {

  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('appSidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function () {
      sidebar.classList.toggle('open');
      if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', function () {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('active');
    });
  }

  setTimeout(() => {
    document.querySelectorAll('.flash-alert').forEach(el => {
      el.style.animation = 'slideInRight 0.35s cubic-bezier(0.4, 0, 0.2, 1) reverse';
      setTimeout(() => el.remove(), 350);
    });
  }, 4500);

  document.querySelectorAll('.flash-close').forEach(btn => {
    btn.addEventListener('click', function () {
      const alert = this.closest('.flash-alert');
      alert.style.animation = 'slideInRight 0.35s cubic-bezier(0.4, 0, 0.2, 1) reverse';
      setTimeout(() => alert.remove(), 350);
    });
  });

  const toggleBtns = document.querySelectorAll('.toggle-password');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const input = this.previousElementSibling;
      if (!input) return;
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', type);
      this.classList.toggle('fa-eye');
      this.classList.toggle('fa-eye-slash');
    });
  });

  const deleteButtons = document.querySelectorAll('[data-delete-url]');
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const url = this.dataset.deleteUrl;
      const name = this.dataset.deleteName || 'this item';
      if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url;
        const methodInput = document.createElement('input');
        methodInput.type = 'hidden';
        methodInput.name = '_method';
        methodInput.value = 'DELETE';
        form.appendChild(methodInput);
        document.body.appendChild(form);
        form.submit();
      }
    });
  });

  const imageInput = document.getElementById('imageInput');
  const imagePreviewBox = document.getElementById('imagePreviewBox');
  const imagePreview = document.getElementById('imagePreview');
  const uploadArea = document.getElementById('uploadArea');

  if (imageInput) {
    imageInput.addEventListener('change', function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (imagePreview) imagePreview.src = e.target.result;
          if (imagePreviewBox) imagePreviewBox.classList.add('visible');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (uploadArea && imageInput) {
    uploadArea.addEventListener('click', () => imageInput.click());

    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files.length) {
        imageInput.files = files;
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (imagePreview) imagePreview.src = ev.target.result;
          if (imagePreviewBox) imagePreviewBox.classList.add('visible');
        };
        reader.readAsDataURL(files[0]);
      }
    });
  }

  const settingsTabs = document.querySelectorAll('.settings-tab');
  settingsTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      settingsTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      const target = this.dataset.target;
      document.querySelectorAll('.settings-panel').forEach(panel => {
        panel.style.display = panel.id === target ? 'block' : 'none';
      });
    });
  });

  const profileTabs = document.querySelectorAll('.profile-tab');
  profileTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      profileTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      const target = this.dataset.target;
      document.querySelectorAll('.profile-panel').forEach(panel => {
        panel.style.display = panel.id === target ? 'block' : 'none';
      });
    });
  });

  initCharts();
});

function initCharts() {
  const userChartEl = document.getElementById('userGrowthChart');
  if (userChartEl) {
    const rawData = userChartEl.dataset.chartData;
    if (!rawData) return;
    let chartData;
    try { chartData = JSON.parse(rawData); } catch (e) { return; }

    const ctx = userChartEl.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.map(d => d.month),
        datasets: [{
          label: 'New Users',
          data: chartData.map(d => d.count),
          borderColor: '#6366f1',
          backgroundColor: gradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#0a0b0f',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1d27',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
            padding: 12,
            cornerRadius: 10,
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y} new users`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
            ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
            ticks: { color: '#64748b', font: { family: 'Inter', size: 11 }, stepSize: 1 },
            beginAtZero: true
          }
        }
      }
    });
  }

  const donutEl = document.getElementById('statusDonutChart');
  if (donutEl) {
    const active = parseInt(donutEl.dataset.active) || 0;
    const total = parseInt(donutEl.dataset.total) || 1;
    const inactive = total - active;

    new Chart(donutEl.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Inactive'],
        datasets: [{
          data: [active, inactive],
          backgroundColor: ['#6366f1', 'rgba(255,255,255,0.07)'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '78%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#94a3b8',
              font: { family: 'Inter', size: 12 },
              padding: 20,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: '#1a1d27',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
            padding: 12,
            cornerRadius: 10
          }
        }
      }
    });
  }
}
