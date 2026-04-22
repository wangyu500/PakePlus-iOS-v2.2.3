// 用户数据模型
let users = JSON.parse(localStorage.getItem('users')) || [];
// 添加管理员账号（如果不存在）
const adminExists = users.some(user => user.username === '王昱');
if (!adminExists) {
    users.push({
        username: '王昱',
        password: '0826',
        points: 9999,
        warehouse: []
    });
}
// 添加或更新妮妮用户，设置积分为52
const niniExists = users.some(user => user.username === '妮妮');
if (niniExists) {
    const niniIndex = users.findIndex(user => user.username === '妮妮');
    users[niniIndex].points = 52;
} else {
    users.push({
        username: '妮妮',
        password: '123456', // 默认密码
        points: 52,
        warehouse: []
    });
}
localStorage.setItem('users', JSON.stringify(users));
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// 商品数据模型
const products = [
    // 奶茶类
    { id: 1, name: '想喝别的（自己备注）', category: 'milk-tea', price: 10, description: '请在备注中说明您的需求' },
    { id: 2, name: '一点点', category: 'milk-tea', price: 8, description: '经典奶茶品牌' },
    { id: 3, name: '益禾堂', category: 'milk-tea', price: 7, description: '性价比高的奶茶' },
    { id: 4, name: '沪上阿姨', category: 'milk-tea', price: 9, description: '上海特色奶茶' },
    { id: 5, name: '霸王茶姬', category: 'milk-tea', price: 10, description: '高端奶茶品牌' },
    { id: 6, name: '蜜雪冰城', category: 'milk-tea', price: 5, description: '平价奶茶连锁' },

    // 情绪系列
    { id: 7, name: '想要别的（自己备注）', category: 'emotion', price: 10, description: '请在备注中说明您的需求' },
    { id: 8, name: '哄哄我', category: 'emotion', price: 10, description: '浪漫惊喜' },
    { id: 9, name: '出去住', category: 'emotion', price: 10, description: '温馨住宿体验' },
    { id: 10, name: '抱抱', category: 'emotion', price: 5, description: '温暖拥抱' },
    { id: 11, name: '骑车遛弯', category: 'emotion', price: 6, description: '浪漫骑行' },
    { id: 12, name: '想见你', category: 'emotion', price: 10, description: '惊喜相见' },
    { id: 13, name: '贴贴', category: 'emotion', price: 4, description: '亲密互动' },

    // 食物类
    { id: 14, name: '想吃别的（自己备注）', category: 'food', price: 10, description: '请在备注中说明您的需求' },
    { id: 15, name: '汉堡薯条', category: 'food', price: 10, description: '经典快餐组合' },
    { id: 16, name: '火锅', category: 'food', price: 10, description: '多人共享火锅' },
    { id: 17, name: '烧烤', category: 'food', price: 10, description: '美味烧烤套餐' },
    { id: 18, name: '麻辣烫', category: 'food', price: 8, description: '麻辣鲜香' },
    { id: 19, name: '螺蛳粉', category: 'food', price: 7, description: '广西特色小吃' },
    { id: 20, name: '家常菜', category: 'food', price: 9, description: '温馨家常风味' },

    // 甜品类
    { id: 21, name: '想吃别的（自己备注）', category: 'dessert', price: 10, description: '请在备注中说明您的需求' },
    { id: 22, name: '蛋糕', category: 'dessert', price: 10, description: '美味生日蛋糕' },
    { id: 23, name: '冰淇淋', category: 'dessert', price: 6, description: '清凉解暑' },
    { id: 24, name: '奶茶甜品', category: 'dessert', price: 8, description: '奶茶搭配甜品' },
    { id: 25, name: '面包', category: 'dessert', price: 5, description: '新鲜烘焙面包' },
    { id: 26, name: '小饼干', category: 'dessert', price: 4, description: '酥脆美味饼干' },
    { id: 27, name: '糖水', category: 'dessert', price: 5, description: '传统中式糖水' },

    // 水果类
    { id: 28, name: '想吃别的（自己备注）', category: 'fruit', price: 10, description: '请在备注中说明您的需求' },
    { id: 29, name: '草莓', category: 'fruit', price: 9, description: '新鲜草莓' },
    { id: 30, name: '芒果', category: 'fruit', price: 8, description: '香甜芒果' },
    { id: 31, name: '西瓜', category: 'fruit', price: 7, description: '清凉西瓜' },
    { id: 32, name: '葡萄', category: 'fruit', price: 8, description: '新鲜葡萄' },
    { id: 33, name: '车厘子', category: 'fruit', price: 10, description: '进口车厘子' },
    { id: 34, name: '榴莲', category: 'fruit', price: 10, description: '新鲜榴莲' }
];

// 购物车状态
let cart = [];

// 初始化页面
function init() {
    // 添加用户认证UI
    addAuthUI();

    // 检查登录状态
    checkLoginStatus();

    // 根据用户类型初始化不同功能
    if (!currentUser || currentUser.username !== '王昱') {
        // 添加商品卡片的交互功能
        addProductInteractions();

        // 创建购物车UI
        createCartUI();

        // 分类导航切换
        setupCategoryNavigation();
    } else {
        // 管理员界面
        showAdminDashboard();
    }
}

// 添加商品交互功能
function addProductInteractions() {
    const productItems = document.querySelectorAll('.product-item');
    productItems.forEach((item, index) => {
        // 为每个商品添加唯一ID
        const productName = item.querySelector('h3').textContent;
        // 去除可能的空格和换行符
        const cleanName = productName.trim();
        const product = products.find(p => p.name === cleanName);
        if (product) {
            item.dataset.productId = product.id;

            // 检查是否已经有加入购物车按钮
            if (!item.querySelector('.add-to-cart')) {
                // 添加添加到购物车按钮
                const addButton = document.createElement('button');
                addButton.className = 'add-to-cart';
                addButton.textContent = '加入购物车';
                addButton.style.marginTop = '10px';
                addButton.style.padding = '8px 16px';
                addButton.style.backgroundColor = '#ff6b9c';
                addButton.style.color = 'white';
                addButton.style.border = 'none';
                addButton.style.borderRadius = '20px';
                addButton.style.cursor = 'pointer';
                addButton.style.fontSize = '0.9rem';
                addButton.addEventListener('click', () => addToCart(product.id));
                item.appendChild(addButton);
            }
        }
    });
}

// 创建购物车UI
function createCartUI() {
    // 创建购物车容器
    const cartContainer = document.createElement('div');
    cartContainer.className = 'cart-container';
    cartContainer.style.position = 'fixed';
    cartContainer.style.top = '20px';
    cartContainer.style.right = '20px';
    cartContainer.style.width = '300px';
    cartContainer.style.backgroundColor = 'white';
    cartContainer.style.borderRadius = '15px';
    cartContainer.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    cartContainer.style.padding = '20px';
    cartContainer.style.zIndex = '1000';

    // 购物车标题
    const cartTitle = document.createElement('h3');
    cartTitle.textContent = '购物车';
    cartTitle.style.color = '#ff6b9c';
    cartTitle.style.marginBottom = '15px';
    cartContainer.appendChild(cartTitle);

    // 购物车内容
    const cartContent = document.createElement('div');
    cartContent.className = 'cart-content';
    cartContent.style.maxHeight = '300px';
    cartContent.style.overflowY = 'auto';
    cartContainer.appendChild(cartContent);

    // 购物车总计
    const cartTotal = document.createElement('div');
    cartTotal.className = 'cart-total';
    cartTotal.style.marginTop = '15px';
    cartTotal.style.paddingTop = '15px';
    cartTotal.style.borderTop = '2px solid #f9f0f4';
    cartContainer.appendChild(cartTotal);

    // 结账按钮
    const checkoutButton = document.createElement('button');
    checkoutButton.className = 'checkout-button';
    checkoutButton.textContent = '去结账';
    checkoutButton.style.width = '100%';
    checkoutButton.style.marginTop = '15px';
    checkoutButton.style.padding = '12px';
    checkoutButton.style.backgroundColor = '#ff6b9c';
    checkoutButton.style.color = 'white';
    checkoutButton.style.border = 'none';
    checkoutButton.style.borderRadius = '20px';
    checkoutButton.style.cursor = 'pointer';
    checkoutButton.style.fontSize = '1rem';
    checkoutButton.addEventListener('click', openCheckoutForm);
    cartContainer.appendChild(checkoutButton);

    document.body.appendChild(cartContainer);

    // 更新购物车
    updateCartUI();
}

// 添加商品到购物车
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showNotification('商品已添加到购物车');
}

// 从购物车移除商品
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    showNotification('商品已从购物车移除');
}

// 调整商品数量
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

// 更新购物车UI
function updateCartUI() {
    const cartContent = document.querySelector('.cart-content');
    const cartTotal = document.querySelector('.cart-total');

    if (!cartContent || !cartTotal) return;

    // 清空购物车内容
    cartContent.innerHTML = '';

    if (cart.length === 0) {
        cartContent.innerHTML = '<p style="text-align: center; color: #999;">购物车为空</p>';
        cartTotal.innerHTML = '<p>总计: ¥0.00</p>';
        return;
    }

    // 计算总计
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const total = subtotal;

    // 添加购物车商品
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.style.display = 'flex';
        itemElement.style.justifyContent = 'space-between';
        itemElement.style.alignItems = 'center';
        itemElement.style.marginBottom = '10px';
        itemElement.style.padding = '10px';
        itemElement.style.backgroundColor = '#f9f0f4';
        itemElement.style.borderRadius = '10px';

        const itemInfo = document.createElement('div');
        itemInfo.style.flex = '1';
        itemInfo.innerHTML = `
            <p style="font-weight: 600; margin: 0;">${item.name}</p>
            <p style="font-size: 0.8rem; color: #666; margin: 5px 0;">¥${item.price.toFixed(2)}</p>
        `;

        const quantityControl = document.createElement('div');
        quantityControl.style.display = 'flex';
        quantityControl.style.alignItems = 'center';
        quantityControl.style.gap = '10px';

        const minusButton = document.createElement('button');
        minusButton.textContent = '-';
        minusButton.style.width = '24px';
        minusButton.style.height = '24px';
        minusButton.style.border = '1px solid #ff6b9c';
        minusButton.style.borderRadius = '50%';
        minusButton.style.backgroundColor = 'white';
        minusButton.style.color = '#ff6b9c';
        minusButton.style.cursor = 'pointer';
        minusButton.addEventListener('click', () => updateQuantity(item.id, -1));

        const quantityDisplay = document.createElement('span');
        quantityDisplay.textContent = item.quantity;
        quantityDisplay.style.minWidth = '30px';
        quantityDisplay.style.textAlign = 'center';

        const plusButton = document.createElement('button');
        plusButton.textContent = '+';
        plusButton.style.width = '24px';
        plusButton.style.height = '24px';
        plusButton.style.border = '1px solid #ff6b9c';
        plusButton.style.borderRadius = '50%';
        plusButton.style.backgroundColor = 'white';
        plusButton.style.color = '#ff6b9c';
        plusButton.style.cursor = 'pointer';
        plusButton.addEventListener('click', () => updateQuantity(item.id, 1));

        const removeButton = document.createElement('button');
        removeButton.textContent = '×';
        removeButton.style.width = '24px';
        removeButton.style.height = '24px';
        removeButton.style.border = 'none';
        removeButton.style.borderRadius = '50%';
        removeButton.style.backgroundColor = '#ff6b9c';
        removeButton.style.color = 'white';
        removeButton.style.cursor = 'pointer';
        removeButton.addEventListener('click', () => removeFromCart(item.id));

        quantityControl.appendChild(minusButton);
        quantityControl.appendChild(quantityDisplay);
        quantityControl.appendChild(plusButton);
        quantityControl.appendChild(removeButton);

        itemElement.appendChild(itemInfo);
        itemElement.appendChild(quantityControl);
        cartContent.appendChild(itemElement);
    });

    // 更新总计
    cartTotal.innerHTML = `
        <p style="font-weight: 600; margin-top: 10px;">总计: ¥${total.toFixed(2)}</p>
    `;
}

// 显示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = '#ff6b9c';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '20px';
    notification.style.zIndex = '2000';
    notification.style.animation = 'fadeInOut 2s ease-in-out';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// 添加用户认证UI
function addAuthUI() {
    // 创建用户认证容器
    const authContainer = document.createElement('div');
    authContainer.className = 'auth-container';
    authContainer.style.position = 'fixed';
    authContainer.style.top = '20px';
    authContainer.style.left = '20px';
    authContainer.style.zIndex = '1000';

    // 登录/注册按钮
    const authButton = document.createElement('button');
    authButton.className = 'auth-button';
    authButton.textContent = currentUser ? `欢迎，${currentUser.username} (${currentUser.points}积分)` : '登录/注册';
    authButton.style.padding = '10px 20px';
    authButton.style.backgroundColor = '#ff6b9c';
    authButton.style.color = 'white';
    authButton.style.border = 'none';
    authButton.style.borderRadius = '20px';
    authButton.style.cursor = 'pointer';
    authButton.style.fontSize = '0.9rem';
    authButton.addEventListener('click', () => {
        if (currentUser) {
            openUserMenu();
        } else {
            openAuthModal();
        }
    });

    authContainer.appendChild(authButton);
    document.body.appendChild(authContainer);
}

// 打开认证模态框
function openAuthModal() {
    // 创建模态框容器
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modalContainer.style.display = 'flex';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.alignItems = 'center';
    modalContainer.style.zIndex = '3000';

    // 模态框内容
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.borderRadius = '15px';
    modalContent.style.padding = '30px';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '400px';

    // 标签切换
    const tabContainer = document.createElement('div');
    tabContainer.style.display = 'flex';
    tabContainer.style.marginBottom = '20px';

    const loginTab = document.createElement('button');
    loginTab.textContent = '登录';
    loginTab.className = 'auth-tab active';
    loginTab.style.flex = '1';
    loginTab.style.padding = '10px';
    loginTab.style.backgroundColor = '#ff6b9c';
    loginTab.style.color = 'white';
    loginTab.style.border = 'none';
    loginTab.style.borderRadius = '10px 0 0 10px';
    loginTab.style.cursor = 'pointer';

    const registerTab = document.createElement('button');
    registerTab.textContent = '注册';
    registerTab.className = 'auth-tab';
    registerTab.style.flex = '1';
    registerTab.style.padding = '10px';
    registerTab.style.backgroundColor = '#ddd';
    registerTab.style.color = '#333';
    registerTab.style.border = 'none';
    registerTab.style.borderRadius = '0 10px 10px 0';
    registerTab.style.cursor = 'pointer';

    tabContainer.appendChild(loginTab);
    tabContainer.appendChild(registerTab);
    modalContent.appendChild(tabContainer);

    // 登录表单
    const loginForm = document.createElement('form');
    loginForm.className = 'auth-form active';
    loginForm.innerHTML = `
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">用户名</label>
            <input type="text" name="username" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
        </div>
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">密码</label>
            <input type="password" name="password" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
        </div>
        <button type="button" class="login-button" style="width: 100%; padding: 12px; background-color: #ff6b9c; color: white; border: none; border-radius: 20px; cursor: pointer;">登录</button>
    `;
    modalContent.appendChild(loginForm);

    // 注册表单
    const registerForm = document.createElement('form');
    registerForm.className = 'auth-form';
    registerForm.style.display = 'none';
    registerForm.innerHTML = `
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">用户名</label>
            <input type="text" name="username" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
        </div>
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">密码</label>
            <input type="password" name="password" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
        </div>
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">确认密码</label>
            <input type="password" name="confirmPassword" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
        </div>
        <button type="button" class="register-button" style="width: 100%; padding: 12px; background-color: #ff6b9c; color: white; border: none; border-radius: 20px; cursor: pointer;">注册</button>
    `;
    modalContent.appendChild(registerForm);

    // 关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '15px';
    closeButton.style.width = '30px';
    closeButton.style.height = '30px';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '50%';
    closeButton.style.backgroundColor = '#ff6b9c';
    closeButton.style.color = 'white';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => modalContainer.remove());
    modalContent.style.position = 'relative';
    modalContent.appendChild(closeButton);

    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);

    // 标签切换事件
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        loginTab.style.backgroundColor = '#ff6b9c';
        loginTab.style.color = 'white';
        registerTab.classList.remove('active');
        registerTab.style.backgroundColor = '#ddd';
        registerTab.style.color = '#333';
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        registerTab.style.backgroundColor = '#ff6b9c';
        registerTab.style.color = 'white';
        loginTab.classList.remove('active');
        loginTab.style.backgroundColor = '#ddd';
        loginTab.style.color = '#333';
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    });

    // 登录按钮事件
    loginForm.querySelector('.login-button').addEventListener('click', () => {
        const username = loginForm.querySelector('input[name="username"]').value;
        const password = loginForm.querySelector('input[name="password"]').value;
        login(username, password, modalContainer);
    });

    // 注册按钮事件
    registerForm.querySelector('.register-button').addEventListener('click', () => {
        const username = registerForm.querySelector('input[name="username"]').value;
        const password = registerForm.querySelector('input[name="password"]').value;
        const confirmPassword = registerForm.querySelector('input[name="confirmPassword"]').value;
        register(username, password, confirmPassword, modalContainer);
    });
}

// 打开用户菜单
function openUserMenu() {
    // 创建菜单容器
    const menuContainer = document.createElement('div');
    menuContainer.className = 'user-menu';
    menuContainer.style.position = 'fixed';
    menuContainer.style.top = '70px';
    menuContainer.style.left = '20px';
    menuContainer.style.backgroundColor = 'white';
    menuContainer.style.borderRadius = '10px';
    menuContainer.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    menuContainer.style.padding = '10px';
    menuContainer.style.zIndex = '1000';

    // 菜单选项
    const menuOptions = [
        { text: `积分: ${currentUser.points}`, action: null },
        { text: '我的仓库', action: openWarehouse }
    ];

    // 管理员选项
    if (currentUser.username === 'admin') {
        menuOptions.push({ text: '管理积分', action: openAdminPanel });
    }

    menuOptions.push({ text: '退出登录', action: logout });

    menuOptions.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.style.padding = '10px 20px';
        optionElement.style.cursor = option.action ? 'pointer' : 'default';
        optionElement.style.borderRadius = '5px';
        optionElement.textContent = option.text;

        if (option.action) {
            optionElement.addEventListener('mouseenter', () => {
                optionElement.style.backgroundColor = '#f9f0f4';
            });
            optionElement.addEventListener('mouseleave', () => {
                optionElement.style.backgroundColor = 'transparent';
            });
            optionElement.addEventListener('click', () => {
                option.action();
                menuContainer.remove();
            });
        }

        menuContainer.appendChild(optionElement);
    });

    document.body.appendChild(menuContainer);

    // 点击外部关闭菜单
    setTimeout(() => {
        document.addEventListener('click', (e) => {
            if (!menuContainer.contains(e.target) && !e.target.classList.contains('auth-button')) {
                menuContainer.remove();
            }
        });
    }, 100);
}

// 登录功能
function login(username, password, modalContainer) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showNotification('登录成功！');
        modalContainer.remove();
        updateAuthUI();
    } else {
        showNotification('用户名或密码错误');
    }
}

// 注册功能
function register(username, password, confirmPassword, modalContainer) {
    if (password !== confirmPassword) {
        showNotification('两次输入的密码不一致');
        return;
    }

    if (users.find(u => u.username === username)) {
        showNotification('用户名已存在');
        return;
    }

    const newUser = {
        username,
        password,
        points: 100, // 初始积分
        warehouse: [] // 仓库
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    showNotification('注册成功！');
    modalContainer.remove();
    updateAuthUI();
}

// 登出功能
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showNotification('已退出登录');
    updateAuthUI();
}

// 更新认证UI
function updateAuthUI() {
    const authButton = document.querySelector('.auth-button');
    if (authButton) {
        authButton.textContent = currentUser ? `欢迎，${currentUser.username} (${currentUser.points}积分)` : '登录/注册';
    }
    
    // 如果管理员面板已打开，更新用户列表中的积分
    const adminPanel = document.querySelector('.admin-panel');
    if (adminPanel) {
        const userSelect = adminPanel.querySelector('select[name="user"]');
        if (userSelect) {
            userSelect.innerHTML = users.map(user => `<option value="${user.username}">${user.username} (${user.points}积分)</option>`).join('');
        }
    }
}

// 检查登录状态
function checkLoginStatus() {
    updateAuthUI();
}

// 打开用户仓库
function openWarehouse() {
    if (!currentUser) {
        showNotification('请先登录');
        return;
    }

    // 创建仓库模态框
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modalContainer.style.display = 'flex';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.alignItems = 'center';
    modalContainer.style.zIndex = '3000';

    // 模态框内容
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.borderRadius = '15px';
    modalContent.style.padding = '30px';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '500px';
    modalContent.style.maxHeight = '90vh';
    modalContent.style.overflowY = 'auto';

    // 标题
    const title = document.createElement('h2');
    title.textContent = '我的仓库';
    title.style.color = '#ff6b9c';
    title.style.marginBottom = '20px';
    title.style.textAlign = 'center';
    modalContent.appendChild(title);

    // 仓库内容
    const warehouseContent = document.createElement('div');
    warehouseContent.className = 'warehouse-content';

    if (currentUser.warehouse.length === 0) {
        warehouseContent.innerHTML = '<p style="text-align: center; color: #999;">仓库为空</p>';
    } else {
        currentUser.warehouse.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.style.display = 'flex';
            itemElement.style.justifyContent = 'space-between';
            itemElement.style.alignItems = 'center';
            itemElement.style.marginBottom = '10px';
            itemElement.style.padding = '15px';
            itemElement.style.backgroundColor = '#f9f0f4';
            itemElement.style.borderRadius = '10px';

            const itemInfo = document.createElement('div');
            itemInfo.innerHTML = `
                <p style="font-weight: 600; margin: 0;">${item.name}</p>
                <p style="font-size: 0.8rem; color: #666; margin: 5px 0;">获取时间: ${item.acquiredAt}</p>
            `;

            const useButton = document.createElement('button');
            useButton.textContent = '使用';
            useButton.style.padding = '8px 16px';
            useButton.style.backgroundColor = '#ff6b9c';
            useButton.style.color = 'white';
            useButton.style.border = 'none';
            useButton.style.borderRadius = '20px';
            useButton.style.cursor = 'pointer';
            useButton.addEventListener('click', () => {
                useItem(index);
                modalContainer.remove();
            });

            itemElement.appendChild(itemInfo);
            itemElement.appendChild(useButton);
            warehouseContent.appendChild(itemElement);
        });
    }

    modalContent.appendChild(warehouseContent);

    // 关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.width = '100%';
    closeButton.style.marginTop = '20px';
    closeButton.style.padding = '12px';
    closeButton.style.backgroundColor = '#ddd';
    closeButton.style.color = '#333';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => modalContainer.remove());
    modalContent.appendChild(closeButton);

    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
}

// 使用仓库中的物品
function useItem(index) {
    if (currentUser && currentUser.warehouse[index]) {
        const item = currentUser.warehouse[index];
        currentUser.warehouse.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showNotification(`已使用 ${item.name}`);
    }
}

// 打开管理员面板
function openAdminPanel() {
    // 创建管理员面板模态框
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modalContainer.style.display = 'flex';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.alignItems = 'center';
    modalContainer.style.zIndex = '3000';

    // 模态框内容
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.borderRadius = '15px';
    modalContent.style.padding = '30px';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '500px';

    // 标题
    const title = document.createElement('h2');
    title.textContent = '管理积分';
    title.style.color = '#ff6b9c';
    title.style.marginBottom = '20px';
    title.style.textAlign = 'center';
    modalContent.appendChild(title);

    // 管理员表单
    const adminForm = document.createElement('form');
    adminForm.innerHTML = `
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">选择用户</label>
            <select name="user" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
                ${users.map(user => `<option value="${user.username}">${user.username} (${user.points}积分)</option>`).join('')}
            </select>
        </div>
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">添加积分</label>
            <input type="number" name="points" min="1" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
        </div>
        <button type="button" class="add-points-button" style="width: 100%; padding: 12px; background-color: #ff6b9c; color: white; border: none; border-radius: 20px; cursor: pointer;">添加积分</button>
    `;
    modalContent.appendChild(adminForm);

    // 关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.width = '100%';
    closeButton.style.marginTop = '15px';
    closeButton.style.padding = '12px';
    closeButton.style.backgroundColor = '#ddd';
    closeButton.style.color = '#333';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => modalContainer.remove());
    modalContent.appendChild(closeButton);

    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);

    // 添加积分按钮事件
    adminForm.querySelector('.add-points-button').addEventListener('click', () => {
        const userSelect = adminForm.querySelector('select[name="user"]');
        const pointsInput = adminForm.querySelector('input[name="points"]');
        const username = userSelect.value;
        const points = parseInt(pointsInput.value);

        if (isNaN(points) || points <= 0) {
            showNotification('请输入有效的积分数量');
            return;
        }

        // 查找用户并添加积分
        const userIndex = users.findIndex(u => u.username === username);
        if (userIndex !== -1) {
            users[userIndex].points += points;
            localStorage.setItem('users', JSON.stringify(users));

            // 如果是当前用户，更新currentUser
            if (currentUser && currentUser.username === username) {
                currentUser = users[userIndex];
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateAuthUI();
            }

            showNotification(`已为 ${username} 添加 ${points} 积分`);

            // 重新加载用户列表
            userSelect.innerHTML = users.map(user => `<option value="${user.username}">${user.username} (${user.points}积分)</option>`).join('');
            pointsInput.value = '';
        } else {
            showNotification('用户不存在');
        }
    });
}

// 打开结账表单
function openCheckoutForm() {
    if (!currentUser) {
        showNotification('请先登录');
        return;
    }

    if (cart.length === 0) {
        showNotification('购物车为空，无法结账');
        return;
    }

    // 创建结账表单容器
    const checkoutContainer = document.createElement('div');
    checkoutContainer.className = 'checkout-container';
    checkoutContainer.style.position = 'fixed';
    checkoutContainer.style.top = '0';
    checkoutContainer.style.left = '0';
    checkoutContainer.style.width = '100%';
    checkoutContainer.style.height = '100%';
    checkoutContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
    checkoutContainer.style.display = 'flex';
    checkoutContainer.style.justifyContent = 'center';
    checkoutContainer.style.alignItems = 'center';
    checkoutContainer.style.zIndex = '3000';

    // 结账表单内容
    const checkoutForm = document.createElement('div');
    checkoutForm.style.backgroundColor = 'white';
    checkoutForm.style.borderRadius = '15px';
    checkoutForm.style.padding = '30px';
    checkoutForm.style.width = '90%';
    checkoutForm.style.maxWidth = '500px';
    checkoutForm.style.maxHeight = '90vh';
    checkoutForm.style.overflowY = 'auto';

    // 表单标题
    const formTitle = document.createElement('h2');
    formTitle.textContent = '结账';
    formTitle.style.color = '#ff6b9c';
    formTitle.style.marginBottom = '20px';
    formTitle.style.textAlign = 'center';
    checkoutForm.appendChild(formTitle);

    // 订单摘要
    const orderSummary = document.createElement('div');
    orderSummary.style.marginBottom = '20px';
    orderSummary.style.padding = '15px';
    orderSummary.style.backgroundColor = '#f9f0f4';
    orderSummary.style.borderRadius = '10px';

    const summaryTitle = document.createElement('h3');
    summaryTitle.textContent = '订单摘要';
    summaryTitle.style.fontSize = '1.1rem';
    summaryTitle.style.marginBottom = '10px';
    orderSummary.appendChild(summaryTitle);

    // 计算订单金额
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const total = subtotal;

    // 添加订单商品
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.style.display = 'flex';
        itemElement.style.justifyContent = 'space-between';
        itemElement.style.marginBottom = '5px';
        itemElement.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>¥${(item.price * item.quantity).toFixed(2)}</span>
        `;
        orderSummary.appendChild(itemElement);
    });

    // 添加订单金额
    const amountElement = document.createElement('div');
    amountElement.style.marginTop = '10px';
    amountElement.style.paddingTop = '10px';
    amountElement.style.borderTop = '1px solid #ff6b9c';
    amountElement.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-top: 10px; font-weight: 600;">
            <span>总计</span>
            <span>¥${total.toFixed(2)}</span>
        </div>
    `;
    orderSummary.appendChild(amountElement);
    checkoutForm.appendChild(orderSummary);

    // 简化的结账表单
    const deliveryForm = document.createElement('form');
    deliveryForm.style.marginBottom = '20px';

    // 只保留备注字段
    const noteField = document.createElement('div');
    noteField.style.marginBottom = '15px';

    const noteLabel = document.createElement('label');
    noteLabel.textContent = '备注';
    noteLabel.style.display = 'block';
    noteLabel.style.marginBottom = '5px';
    noteLabel.style.fontWeight = '500';
    noteField.appendChild(noteLabel);

    const noteTextarea = document.createElement('textarea');
    noteTextarea.name = 'note';
    noteTextarea.style.width = '100%';
    noteTextarea.style.padding = '10px';
    noteTextarea.style.border = '1px solid #ddd';
    noteTextarea.style.borderRadius = '8px';
    noteTextarea.style.resize = 'vertical';
    noteTextarea.style.minHeight = '80px';
    noteField.appendChild(noteTextarea);

    deliveryForm.appendChild(noteField);
    checkoutForm.appendChild(deliveryForm);

    // 按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.justifyContent = 'space-between';

    // 取消按钮
    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = '取消';
    cancelButton.style.flex = '1';
    cancelButton.style.padding = '12px';
    cancelButton.style.backgroundColor = '#ddd';
    cancelButton.style.color = '#333';
    cancelButton.style.border = 'none';
    cancelButton.style.borderRadius = '20px';
    cancelButton.style.cursor = 'pointer';
    cancelButton.addEventListener('click', () => checkoutContainer.remove());
    buttonContainer.appendChild(cancelButton);

    // 提交按钮
    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.textContent = '使用积分支付';
    submitButton.style.flex = '1';
    submitButton.style.padding = '12px';
    submitButton.style.backgroundColor = '#ff6b9c';
    submitButton.style.color = 'white';
    submitButton.style.border = 'none';
    submitButton.style.borderRadius = '20px';
    submitButton.style.cursor = 'pointer';
    submitButton.addEventListener('click', () => {
        // 检查积分是否足够
        if (currentUser.points < total) {
            showNotification('积分不足');
            return;
        }

        // 扣除积分
        currentUser.points -= total;

        // 将商品添加到仓库
        cart.forEach(item => {
            currentUser.warehouse.push({
                id: item.id,
                name: item.name,
                acquiredAt: new Date().toLocaleString()
            });
        });

        // 更新用户数据
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }

        // 模拟订单提交
        showNotification('订单提交成功！商品已添加到仓库');
        setTimeout(() => {
            checkoutContainer.remove();
            cart = [];
            updateCartUI();
            updateAuthUI();
        }, 1500);
    });
    buttonContainer.appendChild(submitButton);

    checkoutForm.appendChild(buttonContainer);
    checkoutContainer.appendChild(checkoutForm);
    document.body.appendChild(checkoutContainer);
}

// 设置分类导航
function setupCategoryNavigation() {
    const categoryItems = document.querySelectorAll('.category-item');
    const productSections = document.querySelectorAll('.product-section');

    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            // 移除所有分类的活跃状态
            categoryItems.forEach(i => i.classList.remove('active'));
            // 添加当前分类的活跃状态
            item.classList.add('active');

            // 获取当前分类
            const category = item.dataset.category;

            // 显示对应分类的商品
            productSections.forEach(section => {
                if (section.id === category) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });

            // 为所有商品添加加入购物车按钮
            addProductInteractions();
        });
    });
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -20px); }
        20% { opacity: 1; transform: translate(-50%, 0); }
        80% { opacity: 1; transform: translate(-50%, 0); }
        100% { opacity: 0; transform: translate(-50%, -20px); }
    }
`;
document.head.appendChild(style);

// 显示管理员仪表盘
function showAdminDashboard() {
    // 清空页面内容，只显示管理员功能
    const kittyKitchen = document.querySelector('.kitty-kitchen');
    if (kittyKitchen) {
        kittyKitchen.style.display = 'none';
    }

    // 创建管理员仪表盘
    const dashboardContainer = document.createElement('div');
    dashboardContainer.className = 'admin-dashboard';
    dashboardContainer.style.position = 'fixed';
    dashboardContainer.style.top = '0';
    dashboardContainer.style.left = '0';
    dashboardContainer.style.width = '100%';
    dashboardContainer.style.height = '100%';
    dashboardContainer.style.backgroundColor = '#f9f0f4';
    dashboardContainer.style.padding = '20px';
    dashboardContainer.style.boxSizing = 'border-box';

    // 标题
    const title = document.createElement('h1');
    title.textContent = '管理员仪表盘';
    title.style.color = '#ff6b9c';
    title.style.textAlign = 'center';
    title.style.marginBottom = '30px';
    dashboardContainer.appendChild(title);

    // 功能卡片容器
    const cardContainer = document.createElement('div');
    cardContainer.style.display = 'grid';
    cardContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
    cardContainer.style.gap = '20px';
    cardContainer.style.maxWidth = '1200px';
    cardContainer.style.margin = '0 auto';

    // 积分管理卡片
    const pointsCard = createAdminCard('积分管理', '管理用户积分', () => openPointsManagement());
    cardContainer.appendChild(pointsCard);

    // 用品核销卡片
    const verifyCard = createAdminCard('用品核销', '核销用户仓库用品', () => openVerifyItems());
    cardContainer.appendChild(verifyCard);

    // 申请处理卡片
    const requestCard = createAdminCard('申请处理', '处理用户用品申请', () => openRequestManagement());
    cardContainer.appendChild(requestCard);

    // 用户管理卡片
    const userCard = createAdminCard('用户管理', '查看所有用户信息', () => openUserManagement());
    cardContainer.appendChild(userCard);

    dashboardContainer.appendChild(cardContainer);

    // 退出按钮
    const logoutButton = document.createElement('button');
    logoutButton.textContent = '退出登录';
    logoutButton.style.position = 'fixed';
    logoutButton.style.bottom = '20px';
    logoutButton.style.right = '20px';
    logoutButton.style.padding = '10px 20px';
    logoutButton.style.backgroundColor = '#ff6b9c';
    logoutButton.style.color = 'white';
    logoutButton.style.border = 'none';
    logoutButton.style.borderRadius = '20px';
    logoutButton.style.cursor = 'pointer';
    logoutButton.addEventListener('click', logout);
    dashboardContainer.appendChild(logoutButton);

    document.body.appendChild(dashboardContainer);
}

// 创建管理员卡片
function createAdminCard(title, description, onClick) {
    const card = document.createElement('div');
    card.style.backgroundColor = 'white';
    card.style.borderRadius = '15px';
    card.style.padding = '30px';
    card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    card.style.cursor = 'pointer';
    card.style.transition = 'transform 0.3s ease';
    card.addEventListener('mouseenter', () => {
        card.style.transform = ' translateY(-5px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
    card.addEventListener('click', onClick);

    const cardTitle = document.createElement('h3');
    cardTitle.textContent = title;
    cardTitle.style.color = '#ff6b9c';
    cardTitle.style.marginBottom = '10px';

    const cardDescription = document.createElement('p');
    cardDescription.textContent = description;
    cardDescription.style.color = '#666';
    cardDescription.style.marginBottom = '20px';

    const icon = document.createElement('div');
    icon.style.fontSize = '2rem';
    icon.style.color = '#ff6b9c';
    icon.style.textAlign = 'center';

    // 根据卡片类型设置图标
    if (title === '积分管理') {
        icon.textContent = '💰';
    } else if (title === '用品核销') {
        icon.textContent = '✓';
    } else if (title === '申请处理') {
        icon.textContent = '📋';
    } else if (title === '用户管理') {
        icon.textContent = '👥';
    }

    card.appendChild(cardTitle);
    card.appendChild(cardDescription);
    card.appendChild(icon);

    return card;
}

// 打开积分管理
function openPointsManagement() {
    // 创建积分管理模态框
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modalContainer.style.display = 'flex';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.alignItems = 'center';
    modalContainer.style.zIndex = '3000';

    // 模态框内容
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.borderRadius = '15px';
    modalContent.style.padding = '30px';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '500px';

    // 标题
    const title = document.createElement('h2');
    title.textContent = '管理积分';
    title.style.color = '#ff6b9c';
    title.style.marginBottom = '20px';
    title.style.textAlign = 'center';
    modalContent.appendChild(title);

    // 管理员表单
    const adminForm = document.createElement('form');
    adminForm.innerHTML = `
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">选择用户</label>
            <select name="user" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
                ${users.filter(u => u.username !== '王昱').map(user => `<option value="${user.username}">${user.username} (${user.points}积分)</option>`).join('')}
            </select>
        </div>
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">添加积分</label>
            <input type="number" name="points" min="1" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
        </div>
        <button type="button" class="add-points-button" style="width: 100%; padding: 12px; background-color: #ff6b9c; color: white; border: none; border-radius: 20px; cursor: pointer;">添加积分</button>
    `;
    modalContent.appendChild(adminForm);

    // 关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.width = '100%';
    closeButton.style.marginTop = '15px';
    closeButton.style.padding = '12px';
    closeButton.style.backgroundColor = '#ddd';
    closeButton.style.color = '#333';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => modalContainer.remove());
    modalContent.appendChild(closeButton);

    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);

    // 添加积分按钮事件
    adminForm.querySelector('.add-points-button').addEventListener('click', () => {
        const userSelect = adminForm.querySelector('select[name="user"]');
        const pointsInput = adminForm.querySelector('input[name="points"]');
        const username = userSelect.value;
        const points = parseInt(pointsInput.value);

        if (isNaN(points) || points <= 0) {
            showNotification('请输入有效的积分数量');
            return;
        }

        // 查找用户并添加积分
        const userIndex = users.findIndex(u => u.username === username);
        if (userIndex !== -1) {
            users[userIndex].points += points;
            localStorage.setItem('users', JSON.stringify(users));

            showNotification(`已为 ${username} 添加 ${points} 积分`);

            // 重新加载用户列表
            userSelect.innerHTML = users.filter(u => u.username !== '王昱').map(user => `<option value="${user.username}">${user.username} (${user.points}积分)</option>`).join('');
            pointsInput.value = '';
        } else {
            showNotification('用户不存在');
        }
    });
}

// 打开用品核销
function openVerifyItems() {
    // 创建用品核销模态框
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modalContainer.style.display = 'flex';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.alignItems = 'center';
    modalContainer.style.zIndex = '3000';

    // 模态框内容
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.borderRadius = '15px';
    modalContent.style.padding = '30px';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '600px';
    modalContent.style.maxHeight = '80vh';
    modalContent.style.overflowY = 'auto';

    // 标题
    const title = document.createElement('h2');
    title.textContent = '用品核销';
    title.style.color = '#ff6b9c';
    title.style.marginBottom = '20px';
    title.style.textAlign = 'center';
    modalContent.appendChild(title);

    // 选择用户
    const userSelectContainer = document.createElement('div');
    userSelectContainer.style.marginBottom = '20px';
    userSelectContainer.innerHTML = `
        <label style="display: block; margin-bottom: 5px; font-weight: 500;">选择用户</label>
        <select id="verify-user-select" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
            <option value="">请选择用户</option>
            ${users.filter(u => u.username !== '王昱').map(user => `<option value="${user.username}">${user.username}</option>`).join('')}
        </select>
    `;
    modalContent.appendChild(userSelectContainer);

    // 用品列表
    const itemsContainer = document.createElement('div');
    itemsContainer.id = 'verify-items-container';
    itemsContainer.style.minHeight = '200px';
    itemsContainer.innerHTML = '<p style="text-align: center; color: #999;">请选择用户查看用品</p>';
    modalContent.appendChild(itemsContainer);

    // 关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.width = '100%';
    closeButton.style.marginTop = '20px';
    closeButton.style.padding = '12px';
    closeButton.style.backgroundColor = '#ddd';
    closeButton.style.color = '#333';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => modalContainer.remove());
    modalContent.appendChild(closeButton);

    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);

    // 用户选择事件
    const userSelect = document.getElementById('verify-user-select');
    userSelect.addEventListener('change', () => {
        const username = userSelect.value;
        const itemsContainer = document.getElementById('verify-items-container');

        if (!username) {
            itemsContainer.innerHTML = '<p style="text-align: center; color: #999;">请选择用户查看用品</p>';
            return;
        }

        const user = users.find(u => u.username === username);
        if (user && user.warehouse) {
            if (user.warehouse.length === 0) {
                itemsContainer.innerHTML = '<p style="text-align: center; color: #999;">该用户仓库为空</p>';
            } else {
                itemsContainer.innerHTML = '';
                user.warehouse.forEach((item, index) => {
                    // 检查物品是否过期（3天有效期）
                    const acquiredDate = new Date(item.acquiredAt);
                    const now = new Date();
                    const daysDiff = Math.floor((now - acquiredDate) / (1000 * 60 * 60 * 24));
                    const isExpired = daysDiff >= 3;

                    const itemElement = document.createElement('div');
                    itemElement.style.display = 'flex';
                    itemElement.style.justifyContent = 'space-between';
                    itemElement.style.alignItems = 'center';
                    itemElement.style.marginBottom = '10px';
                    itemElement.style.padding = '15px';
                    itemElement.style.backgroundColor = isExpired ? '#ffe6e6' : '#f9f0f4';
                    itemElement.style.borderRadius = '10px';

                    const itemInfo = document.createElement('div');
                    itemInfo.innerHTML = `
                        <p style="font-weight: 600; margin: 0;">${item.name}</p>
                        <p style="font-size: 0.8rem; color: #666; margin: 5px 0;">获取时间: ${item.acquiredAt}</p>
                        <p style="font-size: 0.8rem; color: ${isExpired ? '#ff4d4d' : '#666'}; margin: 0;">${isExpired ? '已过期' : `剩余 ${3 - daysDiff} 天`}</p>
                    `;

                    const verifyButton = document.createElement('button');
                    verifyButton.textContent = '核销';
                    verifyButton.style.padding = '8px 16px';
                    verifyButton.style.backgroundColor = '#ff6b9c';
                    verifyButton.style.color = 'white';
                    verifyButton.style.border = 'none';
                    verifyButton.style.borderRadius = '20px';
                    verifyButton.style.cursor = 'pointer';
                    verifyButton.disabled = isExpired;
                    verifyButton.style.opacity = isExpired ? '0.5' : '1';
                    verifyButton.addEventListener('click', () => {
                        // 核销物品
                        user.warehouse.splice(index, 1);
                        localStorage.setItem('users', JSON.stringify(users));
                        showNotification(`已核销 ${item.name}`);
                        // 重新加载物品列表
                        userSelect.dispatchEvent(new Event('change'));
                    });

                    itemElement.appendChild(itemInfo);
                    itemElement.appendChild(verifyButton);
                    itemsContainer.appendChild(itemElement);
                });
            }
        } else {
            itemsContainer.innerHTML = '<p style="text-align: center; color: #999;">该用户仓库为空</p>';
        }
    });
}

// 打开申请处理
function openRequestManagement() {
    // 创建申请处理模态框
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modalContainer.style.display = 'flex';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.alignItems = 'center';
    modalContainer.style.zIndex = '3000';

    // 模态框内容
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.borderRadius = '15px';
    modalContent.style.padding = '30px';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '600px';
    modalContent.style.maxHeight = '80vh';
    modalContent.style.overflowY = 'auto';

    // 标题
    const title = document.createElement('h2');
    title.textContent = '申请处理';
    title.style.color = '#ff6b9c';
    title.style.marginBottom = '20px';
    title.style.textAlign = 'center';
    modalContent.appendChild(title);

    // 模拟申请数据（实际项目中应该从服务器获取）
    const requests = [
        { id: 1, username: '用户1', itemName: '一点点', status: 'pending', requestTime: '2026-04-01 10:00' },
        { id: 2, username: '用户2', itemName: '蛋糕', status: 'pending', requestTime: '2026-04-01 11:30' }
    ];

    // 申请列表
    const requestsContainer = document.createElement('div');

    if (requests.length === 0) {
        requestsContainer.innerHTML = '<p style="text-align: center; color: #999;">暂无申请</p>';
    } else {
        requests.forEach(request => {
            const requestElement = document.createElement('div');
            requestElement.style.marginBottom = '15px';
            requestElement.style.padding = '20px';
            requestElement.style.backgroundColor = '#f9f0f4';
            requestElement.style.borderRadius = '10px';

            requestElement.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <h4 style="margin: 0; color: #ff6b9c;">${request.username}</h4>
                    <span style="padding: 4px 12px; background-color: ${request.status === 'pending' ? '#ffd700' : '#4CAF50'}; color: white; border-radius: 12px; font-size: 0.8rem;">${request.status === 'pending' ? '待处理' : '已处理'}</span>
                </div>
                <p style="margin: 5px 0;"><strong>申请物品:</strong> ${request.itemName}</p>
                <p style="margin: 5px 0; font-size: 0.8rem; color: #666;"><strong>申请时间:</strong> ${request.requestTime}</p>
            `;

            if (request.status === 'pending') {
                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.gap = '10px';
                buttonContainer.style.marginTop = '15px';

                const approveButton = document.createElement('button');
                approveButton.textContent = '同意';
                approveButton.style.flex = '1';
                approveButton.style.padding = '8px';
                approveButton.style.backgroundColor = '#4CAF50';
                approveButton.style.color = 'white';
                approveButton.style.border = 'none';
                approveButton.style.borderRadius = '20px';
                approveButton.style.cursor = 'pointer';
                approveButton.addEventListener('click', () => {
                    showNotification(`已同意 ${request.username} 的申请`);
                    requestElement.querySelector('span').textContent = '已处理';
                    requestElement.querySelector('span').style.backgroundColor = '#4CAF50';
                    buttonContainer.remove();
                });

                const rejectButton = document.createElement('button');
                rejectButton.textContent = '拒绝';
                rejectButton.style.flex = '1';
                rejectButton.style.padding = '8px';
                rejectButton.style.backgroundColor = '#f44336';
                rejectButton.style.color = 'white';
                rejectButton.style.border = 'none';
                rejectButton.style.borderRadius = '20px';
                rejectButton.style.cursor = 'pointer';
                rejectButton.addEventListener('click', () => {
                    showNotification(`已拒绝 ${request.username} 的申请`);
                    requestElement.querySelector('span').textContent = '已处理';
                    requestElement.querySelector('span').style.backgroundColor = '#4CAF50';
                    buttonContainer.remove();
                });

                buttonContainer.appendChild(approveButton);
                buttonContainer.appendChild(rejectButton);
                requestElement.appendChild(buttonContainer);
            }

            requestsContainer.appendChild(requestElement);
        });
    }

    modalContent.appendChild(requestsContainer);

    // 关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.width = '100%';
    closeButton.style.marginTop = '20px';
    closeButton.style.padding = '12px';
    closeButton.style.backgroundColor = '#ddd';
    closeButton.style.color = '#333';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => modalContainer.remove());
    modalContent.appendChild(closeButton);

    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
}

// 打开用户管理
function openUserManagement() {
    // 创建用户管理模态框
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modalContainer.style.display = 'flex';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.alignItems = 'center';
    modalContainer.style.zIndex = '3000';

    // 模态框内容
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.borderRadius = '15px';
    modalContent.style.padding = '30px';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '600px';
    modalContent.style.maxHeight = '80vh';
    modalContent.style.overflowY = 'auto';

    // 标题
    const title = document.createElement('h2');
    title.textContent = '用户管理';
    title.style.color = '#ff6b9c';
    title.style.marginBottom = '20px';
    title.style.textAlign = 'center';
    modalContent.appendChild(title);

    // 用户列表
    const usersContainer = document.createElement('div');

    if (users.length === 0) {
        usersContainer.innerHTML = '<p style="text-align: center; color: #999;">暂无用户</p>';
    } else {
        users.forEach(user => {
            if (user.username === '王昱') return; // 跳过管理员

            const userElement = document.createElement('div');
            userElement.style.marginBottom = '15px';
            userElement.style.padding = '20px';
            userElement.style.backgroundColor = '#f9f0f4';
            userElement.style.borderRadius = '10px';

            userElement.innerHTML = `
                <h4 style="margin: 0; color: #ff6b9c;">${user.username}</h4>
                <p style="margin: 5px 0;"><strong>积分:</strong> ${user.points}</p>
                <p style="margin: 5px 0;"><strong>仓库物品数:</strong> ${user.warehouse ? user.warehouse.length : 0}</p>
            `;

            usersContainer.appendChild(userElement);
        });
    }

    modalContent.appendChild(usersContainer);

    // 关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.width = '100%';
    closeButton.style.marginTop = '20px';
    closeButton.style.padding = '12px';
    closeButton.style.backgroundColor = '#ddd';
    closeButton.style.color = '#333';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => modalContainer.remove());
    modalContent.appendChild(closeButton);

    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
}