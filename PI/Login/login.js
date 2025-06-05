// login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    // Mapeamento de usuários e suas páginas de destino
    const users = {
        'aluno@sanquim.com': { password: 'aluno123', redirect: '../Aluno/dashboard.html', role: 'aluno' },
        'professor@sanquim.com': { password: 'prof123', redirect: '../Professor/portal_professor.html', role: 'professor' }, // NOVO: Redireciona para portal_professor.html
        'admin@sanquim.com': { password: 'admin123', redirect: 'portal_admin.html', role: 'admin' } // Futuro: Portal do Administrador
    };

    // --- Lógica de Login (Executada apenas na página de login) ---
    if (loginForm) { // Garante que esta lógica só execute na página login.html
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            const email = emailInput.value;
            const password = passwordInput.value;

            if (users[email] && users[email].password === password) {
                // Login bem-sucedido
                // Salva o e-mail do usuário logado e sua role no localStorage para manter o estado
                localStorage.setItem('loggedInUserEmail', email);
                localStorage.setItem('loggedInUserRole', users[email].role);

                window.location.href = users[email].redirect; // Redireciona para a página do perfil
            } else {
                errorMessage.textContent = 'E-mail ou senha inválidos.';
                errorMessage.style.display = 'block';
            }
        });
    }

    // --- Lógica de Logout (Para todos os botões "Sair" em qualquer página) ---
    // Esta parte do código deve ser executada em TODAS as páginas.
    const logoutButtons = document.querySelectorAll('.nav-item[data-page="sair"]');
    logoutButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Impede o redirecionamento padrão do link

            // Remove os dados do usuário logado do localStorage
            localStorage.removeItem('loggedInUserEmail');
            localStorage.removeItem('loggedInUserRole');

            // Redireciona para a página de login
            window.location.href = '../Login/login.html';
        });
    });

    // --- Verificação de Autenticação para Páginas Protegidas ---
    // Esta parte também deve ser executada em TODAS as páginas para garantir o controle de acesso.
    const currentPageFilename = window.location.pathname.split('/').pop();
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    const loggedInUserRole = localStorage.getItem('loggedInUserRole');

    // Mapeia quais roles têm acesso a quais páginas
    const pageAccessRoles = {
        'dashboard.html': 'aluno',
        'perfil.html': 'aluno',
        'frequencia.html': 'aluno',
        'notas.html': 'aluno',
        'aulas.html': 'aluno',
        'contato.html': ['aluno', 'professor', 'admin'], // Contato pode ser acessado por todos
        'portal_professor.html': 'professor',
        'minhas_turmas.html': 'professor',
        'gerenciar_turma.html': 'professor',
        'avisos_turmas.html': 'professor',
        'portal_admin.html': 'admin' // Futuro: Portal do Administrador
    };

    // Verifica se a página atual é uma página protegida
    if (Object.keys(pageAccessRoles).includes(currentPageFilename)) {
        // Se não houver usuário logado, redireciona para o login
        if (!loggedInUserEmail) {
            window.location.href = '../Login/login.html';
            return;
        }

        // Verifica se a role do usuário logado tem permissão para a página
        const allowedRoles = pageAccessRoles[currentPageFilename];
        let hasPermission = false;
        if (Array.isArray(allowedRoles)) { // Se for um array de roles permitidas
            hasPermission = allowedRoles.includes(loggedInUserRole);
        } else { // Se for uma única role
            hasPermission = (allowedRoles === loggedInUserRole);
        }

        if (!hasPermission) {
            alert('Acesso negado. Você não tem permissão para esta área.');
            // Redireciona para o dashboard correto do usuário logado ou para a página de login
            if (loggedInUserEmail && users[loggedInUserEmail]) {
                 window.location.href = users[loggedInUserEmail].redirect;
            } else {
                 window.location.href = '../Login/login.html';
            }
            return;
        }

    } else if (currentPageFilename === '../Login/login.html' && loggedInUserEmail) {
        // Se já está logado e tenta acessar a página de login, redireciona para o dashboard apropriado
        const redirectTo = users[loggedInUserEmail] ? users[loggedInUserEmail].redirect : '../Aluno/dashboard.html'; // Default para aluno se algo der errado
        window.location.href = redirectTo;
        return;
    }

    // --- Lógica para Ativar o item da Navbar (APENAS se não tiver um dashboard.js global fazendo isso) ---
    // Se o seu dashboard.js já faz isso para todas as páginas, você pode remover este bloco daqui.
    // Mas para garantir, podemos mantê-lo aqui ou replicá-lo em cada JS de página.
    // Para este recomeço, vamos considerar que ele estará em cada JS de página (portal_professor.js, dashboard.js, etc.)
});