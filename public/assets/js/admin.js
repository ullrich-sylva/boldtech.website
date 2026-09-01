document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('adminToken');

  // If no token, redirect to login page
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  let allMessages = [];
  let selectedMessage = null;

  const messagesTableBody = document.getElementById('messagesTableBody');
  const statusFilter = document.getElementById('statusFilter');
  const serviceFilter = document.getElementById('serviceFilter');
  const logoutBtn = document.getElementById('logoutBtn');

  // Stats Elements
  const statTotal = document.getElementById('statTotal');
  const statUnread = document.getElementById('statUnread');
  const statTreated = document.getElementById('statTreated');

  // Modal Elements
  const messageModal = document.getElementById('messageModal');
  const closeModal = document.querySelector('.close-modal');
  const modalSubject = document.getElementById('modalSubject');
  const modalSender = document.getElementById('modalSender');
  const modalDate = document.getElementById('modalDate');
  const modalEmail = document.getElementById('modalEmail');
  const modalPhone = document.getElementById('modalPhone');
  const modalService = document.getElementById('modalService');
  const modalStatusTag = document.getElementById('modalStatusTag');
  const modalText = document.getElementById('modalText');

  // Modal Action Buttons
  const markReadBtn = document.getElementById('markReadBtn');
  const markTreatedBtn = document.getElementById('markTreatedBtn');
  const deleteMessageBtn = document.getElementById('deleteMessageBtn');

  // Fetch messages from Server
  function fetchMessages() {
    fetch('/api/admin/messages', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = 'login.html';
        throw new Error('Non autorisé');
      }
      return res.json();
    })
    .then(data => {
      if (data.success) {
        allMessages = data.messages;
        renderDashboard();
      }
    })
    .catch(err => {
      console.error(err);
      messagesTableBody.innerHTML = `<tr><td colspan="6" class="table-error"><i class="fas fa-exclamation-triangle"></i> Impossible de charger les messages.</td></tr>`;
    });
  }

  // Calculate statistics and render table
  function renderDashboard() {
    // Update Stats
    const total = allMessages.length;
    const unread = allMessages.filter(m => m.status === 'non_lu').length;
    const treated = allMessages.filter(m => m.status === 'traite').length;

    statTotal.textContent = total;
    statUnread.textContent = unread;
    statTreated.textContent = treated;

    // Filter messages
    const selectedStatus = statusFilter.value;
    const selectedService = serviceFilter.value;

    const filtered = allMessages.filter(msg => {
      const matchStatus = selectedStatus === 'tous' || msg.status === selectedStatus;
      const matchService = selectedService === 'tous' || msg.subject === selectedService;
      return matchStatus && matchService;
    });

    // Populate Table
    if (filtered.length === 0) {
      messagesTableBody.innerHTML = `<tr><td colspan="6" class="table-empty">Aucun message trouvé.</td></tr>`;
      return;
    }

    messagesTableBody.innerHTML = '';
    filtered.forEach(msg => {
      const row = document.createElement('tr');
      row.className = msg.status === 'non_lu' ? 'row-unread' : '';

      // Format Date
      const date = new Date(msg.created_at).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Format Status Badge
      let statusClass = 'status-unread';
      let statusText = 'Non lu';
      if (msg.status === 'lu') {
        statusClass = 'status-read';
        statusText = 'Lu';
      } else if (msg.status === 'traite') {
        statusClass = 'status-treated';
        statusText = 'Traité';
      }

      // Translate service name helper
      const serviceNames = {
        'reseaux': 'Réseaux',
        'maintenance': 'Maintenance',
        'videosurveillance': 'Vidéosurveillance',
        'solaire': 'Énergie Solaire',
        'cloud': 'Cloud',
        'flotte': 'Flotte Automobile',
        'autre': 'Autre'
      };
      const serviceDisplay = serviceNames[msg.subject] || msg.subject || 'Général';

      row.innerHTML = `
        <td>${date}</td>
        <td class="font-bold">${msg.name}</td>
        <td>
          <div class="contact-info-cell">
            <span><i class="fas fa-envelope"></i> ${msg.email}</span>
            ${msg.phone ? `<span><i class="fas fa-phone"></i> ${msg.phone}</span>` : ''}
          </div>
        </td>
        <td><span class="service-badge">${serviceDisplay}</span></td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>
          <button class="btn-icon btn-view" title="Consulter"><i class="fas fa-eye"></i></button>
          <button class="btn-icon btn-delete" title="Supprimer"><i class="fas fa-trash-alt"></i></button>
        </td>
      `;

      // Event Listeners for actions
      row.querySelector('.btn-view').addEventListener('click', () => openMessageModal(msg));
      row.querySelector('.btn-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        confirmDelete(msg.id);
      });

      messagesTableBody.appendChild(row);
    });
  }

  // Open Detailed Modal
  function openMessageModal(msg) {
    selectedMessage = msg;

    modalSubject.textContent = `Message de ${msg.name}`;
    modalSender.textContent = msg.name;
    modalDate.textContent = new Date(msg.created_at).toLocaleString('fr-FR');
    modalEmail.innerHTML = `<a href="mailto:${msg.email}">${msg.email}</a>`;
    modalPhone.textContent = msg.phone || 'Non renseigné';
    modalText.textContent = msg.message;

    // Service translation
    const serviceNames = {
      'reseaux': 'Réseaux Informatiques',
      'maintenance': 'Maintenance',
      'videosurveillance': 'Vidéosurveillance & Sécurité',
      'solaire': 'Énergie Solaire',
      'cloud': 'Cloud Computing',
      'flotte': 'Gestion de Flotte',
      'autre': 'Autre'
    };
    modalService.textContent = serviceNames[msg.subject] || msg.subject || 'Général';

    // Set status modal view
    updateModalStatusView(msg.status);

    // If message is unread, automatically mark it as read
    if (msg.status === 'non_lu') {
      updateMessageStatus(msg.id, 'lu');
    }

    messageModal.style.display = 'block';
  }

  function updateModalStatusView(status) {
    modalStatusTag.className = 'status-badge';
    if (status === 'non_lu') {
      modalStatusTag.classList.add('status-unread');
      modalStatusTag.textContent = 'Non lu';
      markReadBtn.style.display = 'inline-flex';
    } else if (status === 'lu') {
      modalStatusTag.classList.add('status-read');
      modalStatusTag.textContent = 'Lu';
      markReadBtn.style.display = 'none';
    } else if (status === 'traite') {
      modalStatusTag.classList.add('status-treated');
      modalStatusTag.textContent = 'Traité';
      markReadBtn.style.display = 'none';
    }
  }

  // Update Message Status on Server
  function updateMessageStatus(id, newStatus) {
    fetch(`/api/admin/messages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Update local array
        const index = allMessages.findIndex(m => m.id === id);
        if (index !== -1) {
          allMessages[index].status = newStatus;
          updateModalStatusView(newStatus);
          renderDashboard();
        }
      }
    })
    .catch(err => console.error(err));
  }

  // Delete message on Server
  function confirmDelete(id) {
    if (confirm('Voulez-vous vraiment supprimer ce message définitivement ?')) {
      fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          allMessages = allMessages.filter(m => m.id !== id);
          if (messageModal.style.display === 'block' && selectedMessage?.id === id) {
            messageModal.style.display = 'none';
          }
          renderDashboard();
        }
      })
      .catch(err => console.error(err));
    }
  }

  // Bind Actions on Open Modal
  markReadBtn.addEventListener('click', () => {
    if (selectedMessage) {
      updateMessageStatus(selectedMessage.id, 'lu');
    }
  });

  markTreatedBtn.addEventListener('click', () => {
    if (selectedMessage) {
      updateMessageStatus(selectedMessage.id, 'traite');
    }
  });

  deleteMessageBtn.addEventListener('click', () => {
    if (selectedMessage) {
      confirmDelete(selectedMessage.id);
    }
  });

  // Close Modal
  closeModal.addEventListener('click', () => {
    messageModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === messageModal) {
      messageModal.style.display = 'none';
    }
  });

  // Filter Event Listeners
  statusFilter.addEventListener('change', renderDashboard);
  serviceFilter.addEventListener('change', renderDashboard);

  // Logout Function
  logoutBtn.addEventListener('click', () => {
    fetch('/api/admin/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .finally(() => {
      localStorage.removeItem('adminToken');
      window.location.href = 'login.html';
    });
  });

  // Initial Fetch
  fetchMessages();
});
