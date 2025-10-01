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
                console.error('Ошибка загрузки аватарки пиздец кароче:', error);
            }
        }        
        document.querySelectorAll('.tab-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.style.animation = 'none';
                    setTimeout(() => {
                        content.style.animation = '';
                        content.classList.remove('active');
                    }, 10);
                });
                
                button.classList.add('active');
                const tabId = button.getAttribute('data-tab');
                const activeContent = document.getElementById(tabId);
                setTimeout(() => {
                    activeContent.classList.add('active');
                }, 50);
            });
        });
        window.addEventListener('load', () => {
            loadBotAvatar();
            document.querySelector('.container').style.opacity = '0';
            document.querySelector('.container').style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                document.querySelector('.container').style.transition = 'all 0.8s ease';
                document.querySelector('.container').style.opacity = '1';
                document.querySelector('.container').style.transform = 'translateY(0)';
            }, 100);
        });
