 let isLoggedIn = false;
        async function loadBotData() {
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

                const statusIndicator = document.getElementById('statusIndicator');
                if (data.status === "OK") {
                    statusIndicator.className = 'status-indicator status-online';
                } else {
                    statusIndicator.className = 'status-indicator status-offline';
                }

                document.getElementById('botUsername').textContent = data.client_bot.username;
                document.getElementById('botServers').textContent = data.client_bot.serverCount + ' серверов';
                document.getElementById('botPing').textContent = data.client_bot.ping + ' мс';
                document.getElementById('botUptime').textContent = data.uptime.formatted;
                
            } catch (error) {;
                const statusIndicator = document.getElementById('statusIndicator');
                statusIndicator.className = 'status-indicator status-offline';
                
                document.getElementById('botUsername').textContent = 'Ошибка загрузки хуйни';
                document.getElementById('botServers').textContent = 'Ошибка загрузки хуй';
                document.getElementById('botPing').textContent = 'Ошибка загрузки Хрень';
                document.getElementById('botUptime').textContent = 'Ошибка загрузки херота';
            }
        }

        function checkPassword() {
            const passwordInput = document.getElementById('passwordInput');
            const errorMessage = document.getElementById('errorMessage');
            const authSection = document.getElementById('authSection');
            const buttonsSection = document.getElementById('buttonsSection');
            const socialLinks = document.getElementById('socialLinks');
            const logoContainer = document.getElementById('logoContainer');
            
            if (passwordInput.value.trim() === '') {
                errorMessage.textContent = 'Invalid password';
                return;
            }

            errorMessage.textContent = '';
            isLoggedIn = true;

            authSection.classList.add('hidden');

            setTimeout(() => {
                buttonsSection.classList.add('visible');
                socialLinks.classList.add('visible');
            }, 500);
        }
        

        document.getElementById('botLogo').addEventListener('mouseenter', function() {
            if (!isLoggedIn) return;
            
            const buttonsSection = document.getElementById('buttonsSection');
            const socialLinks = document.getElementById('socialLinks');
            const logoContainer = document.getElementById('logoContainer');
            
            buttonsSection.classList.add('move-down');
            socialLinks.classList.add('move-down');
            logoContainer.classList.add('show-info');
        });
        
        document.getElementById('botLogo').addEventListener('mouseleave', function() {
            const buttonsSection = document.getElementById('buttonsSection');
            const socialLinks = document.getElementById('socialLinks');
            const logoContainer = document.getElementById('logoContainer');
            
            buttonsSection.classList.remove('move-down');
            socialLinks.classList.remove('move-down');
            logoContainer.classList.remove('show-info');
        });
        
  
        document.getElementById('passwordInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
        
        window.onload = function() {
            loadBotData();
        };

        setInterval(loadBotData, 30000);