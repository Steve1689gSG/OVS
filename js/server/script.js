let serversData = [];
let currentPage = 1;
const serversPerPage = 9;
let serversWithStatus = [];
let sortByRating = true;

async function loadServersFromJSON() {
    try {
        const response = await fetch('../../data/servers.json');
        const data = await response.json();
        serversData = data.servers;
        return true;
    } catch (error) {
        console.error('Ошибка загрузки servers.json:', error);
        serversData = [
            {
                "name": "localhost",
                "ip": "localhost",
                "rating": 5,
                "description": "сайт не смог найти базу даных так что localhost",
                "tags": ["Ошибка 404"]
            }
        ];
        return false;
    }
}

async function getServerStatus(ip) {
    try {
        const response = await fetch(`https://api.mcsrvstat.us/2/${ip}`);
        const data = await response.json();
        return data;
    } catch (error) {
        return { online: false };
    }
}

async function loadAllServerStatuses() {
    const loadingElement = document.getElementById('loading');
    loadingElement.textContent = 'Загрузка списка серверов...';
    
    const jsonLoaded = await loadServersFromJSON();
    
    if (!jsonLoaded) {
        loadingElement.textContent = 'Ошибка загрузки серверов';
        return;
    }
    
    loadingElement.textContent = 'Получение статусов серверов...';
    serversWithStatus = [];
    
    for (let i = 0; i < serversData.length; i++) {
        const server = serversData[i];
        const status = await getServerStatus(server.ip);
        serversWithStatus.push({
            ...server,
            index: i,
            status: status
        });
    }
    applySorting();
    
    loadingElement.style.display = 'none';
    displayServers(currentPage);
}

function applySorting() {
    if (sortByRating) {
        serversWithStatus.sort((a, b) => b.rating - a.rating);
    } else {
        serversWithStatus.sort((a, b) => a.rating - b.rating);
    }
}

function toggleSorting() {
    sortByRating = !sortByRating;
    applySorting();
    displayServers(currentPage);
    const sortBtn = document.getElementById('sortBtn');
    if (sortBtn) {
        sortBtn.innerHTML = sortByRating ? 
            'Сортировка: По возрастанию' : 
            'Сортировка: По убыванию';
    }
}

function displayServers(page = 1) {
    const serversGrid = document.getElementById('serversGrid');
    const startIndex = (page - 1) * serversPerPage;
    const endIndex = startIndex + serversPerPage;
    const paginatedServers = serversWithStatus.slice(startIndex, endIndex);

    serversGrid.innerHTML = '';

    if (paginatedServers.length === 0) {
        serversGrid.innerHTML = '<div class="no-servers">Серверы не найдены</div>';
        return;
    }

    paginatedServers.forEach(server => {
        const status = server.status;
        const isOnline = status.online;
        const players = isOnline ? status.players?.online || 0 : 0;
        const maxPlayers = isOnline ? status.players?.max || 0 : 0;
        const version = isOnline ? status.version || 'N/A' : 'Оффлайн';
        const icon = isOnline && status.icon ? status.icon : '../../images/default-server.png';

        const serverCard = document.createElement('div');
        serverCard.className = 'server-card';
        serverCard.innerHTML = `
            <div class="server-header">
                <img src="${icon}" alt="${server.name}" class="server-icon" onerror="this.src='../images/default-server.png'">
                <div class="server-info">
                    <h3>${server.name}</h3>
                    <div class="server-ip">${server.ip}</div>
                    <div class="server-status ${isOnline ? 'online' : 'offline'}">
                        ${isOnline ? '🟢 Онлайн' : '🔴 Оффлайн'}
                    </div>
                </div>
            </div>
            <div class="server-stats">
                <div class="stat players ${isOnline ? 'online' : 'offline'}">
                    👥 ${players}/${maxPlayers}
                </div>
                <div class="stat version">
                    🎮 ${version}
                </div>
                <div class="stat rating">
                    ⭐ ${server.rating}
                </div>
            </div>
            <div class="server-description">${server.description}</div>
            <div class="server-tags">
                ${server.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="server-actions">
                <button class="copy-btn" onclick="copyIP('${server.ip}')">Копировать IP</button>
                <button class="details-btn" onclick="showServerDetails(${server.index})">Подробнее</button>
            </div>
        `;
        serversGrid.appendChild(serverCard);
    });

    updatePagination();
}

function updatePagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(serversWithStatus.length / serversPerPage);
    
    pagination.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => {
            currentPage = i;
            displayServers(i);
        };
        pagination.appendChild(pageBtn);
    }
}

function copyIP(ip) {
    navigator.clipboard.writeText(ip).then(() => {
        alert(`IP адрес ${ip} скопирован!`);
    });
}

function showServerDetails(serverIndex) {
    const server = serversWithStatus.find(s => s.index === serverIndex);
    if (!server) return;
    
    const status = server.status;
    const isOnline = status.online;
    
    const modal = document.getElementById('serverModal');
    const modalContent = document.getElementById('modalContent');
    
    let detailsHTML = `
        <div class="server-header">
            <img src="${isOnline && status.icon ? status.icon : '../images/default-server.png'}" 
                 alt="${server.name}" class="server-icon"
                 onerror="this.src='../images/default-server.png'">
            <div class="server-info">
                <h3>${server.name}</h3>
                <div class="server-ip">${server.ip}</div>
                <div class="server-status ${isOnline ? 'online' : 'offline'}">
                    ${isOnline ? '🟢 Онлайн' : '🔴 Оффлайн'}
                </div>
            </div>
        </div>
        <div class="server-stats">
            <div class="stat players ${isOnline ? 'online' : 'offline'}">
                👥 ${isOnline ? (status.players?.online || 0) : 0}/${isOnline ? (status.players?.max || 0) : 0}
            </div>
            <div class="stat version">
                🎮 ${isOnline ? (status.version || 'N/A') : 'Оффлайн'}
            </div>
            <div class="stat rating">
                ⭐ ${server.rating}/5.0
            </div>
        </div>
        <div class="server-description">${server.description}</div>
        <div class="server-tags">
            ${server.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div style="margin-top: 20px;">
            <h4 style="color: #aaa; margin-bottom: 10px;">Детальная информация:</h4>
    `;

    if (isOnline) {
        detailsHTML += `
            <p><strong>MOTD:</strong> ${status.motd?.clean?.[0] || 'Нет описания'}</p>
            <p><strong>Версия:</strong> ${status.version || 'N/A'}</p>
            <p><strong>Игроки онлайн:</strong> ${status.players?.online || 0}</p>
            <p><strong>Макс. игроков:</strong> ${status.players?.max || 0}</p>
            ${status.players?.list ? `<p><strong>Игроки:</strong> ${status.players.list.slice(0, 10).join(', ')}${status.players.list.length > 10 ? '...' : ''}</p>` : ''}
            ${status.software ? `<p><strong>ПО:</strong> ${status.software}</p>` : ''}
            ${status.plugins ? `<p><strong>Плагины:</strong> ${status.plugins.names?.slice(0, 5).join(', ') || 'N/A'}${status.plugins.names?.length > 5 ? '...' : ''}</p>` : ''}
        `;
    } else {
        detailsHTML += `<p style="color: #ff4444;">Сервер в настоящее время недоступен</p>`;
    }

    detailsHTML += `</div>
        <button class="copy-btn" onclick="copyIP('${server.ip}')" style="margin-top: 20px; width: 100%;">Копировать IP</button>
    `;

    modalContent.innerHTML = detailsHTML;
    modal.style.display = 'flex';
}

document.getElementById('closeModal').onclick = function() {
    document.getElementById('serverModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('serverModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

async function loadBotAvatar() {
    try {
        const response = await fetch('../../bot-sesia/health');
        const data = await response.json();
        const botLogo = document.getElementById('botLogo');
        botLogo.src = data.client_bot.avatar;
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = data.client_bot.avatar;
        link.type = 'image/x-icon';
        document.head.appendChild(link);
    } catch (error) {
        const botLogo = document.getElementById('botLogo');
        botLogo.src = '../images/default-avatar.png';
    }
}

window.addEventListener('load', () => {
    loadBotAvatar();
    loadAllServerStatuses();
    setInterval(loadAllServerStatuses, 30000);
    document.getElementById('sortBtn').addEventListener('click', toggleSorting);
});