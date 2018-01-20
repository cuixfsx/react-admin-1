import Mock from 'mockjs';

Mock.setup({
    timeout: '200-2000',
});

/**
 * 模拟数据
 * **/
// ID序列
let id_sequence = 1000;

// 用户数据
const users = [
    { id: 1, username: 'admin', password: '123456' },
    { id: 2, username: 'user', password: '123456'}
];

// 头部消息数据
const msg = {
    notice: [   // 通知数据
        {title: '你收到了14份新周报', time: '昨天', icon: 'mail', color: '#FE5D58'},
        {title: '国庆节放假安排', time: '今天上午', icon: 'star', color: '#3391E5'},
        {title: 'leader 将你添加到开发小组', time: '今天上午', icon: 'team', color: '#9DDEDE'},
    ],
    message: [  // 消息数据
        {title: '小明回复了你', time: '昨天', info: '最新的代码已经提交至git，请拉取更新', icon: 'smile-o', color: '#FE5D58'},
        {title: '小红评论了你', time: '今天上午', info: '之前封装的组件可以正常使用，兼容性没有问题哦', icon: 'smile-o', color: '#3391E5'},
    ],
    work: [ // 待办数据
        {title: '新系统部署', info: '服务器环境已经搭建完毕，需要下一步部署', type:'未开始', color:''},
        {title: '需求变更', info: '需求又TM变啦，哥，改一下咯', type:'进行中', color: 'blue'},
        {title: 'A版本代码合并', info: 'git上的分支需合并至master', type:'已完成', color: 'geekblue'},
    ]
};

// 所有的菜单数据
const menus = [
    { id: 1, title: '系统管理', icon: 'set', url: '/system', parent: null, desc: '系统管理目录分支', sorts: 0, conditions: 1  },
    { id: 2, title: '用户管理', icon: 'user', url: '/consumer', parent: 1, desc: '系统管理/用户管理', sorts: 0, conditions: 1  },
    { id: 3, title: '角色管理', icon: 'user', url: '/role', parent: 1, desc: '系统管理/角色管理', sorts: 1, conditions: 1  },
    { id: 4, title: '权限管理', icon: 'user', url: '/power', parent: 1, desc: '系统管理/权限管理', sorts: 2, conditions: 1  },
    { id: 5, title: '菜单管理', icon: 'menu', url: '/menuadmin', parent: 1, desc: '系统管理/菜单管理', sorts: 3, conditions: 1  },
];

/**
 * 方法
 * **/
// 登录
const onLogin = (request) => {
    const p = JSON.parse(request.body);
    console.log(p, users);
    const u = users.find((item, index) => {
        return item.username === p.username;
    });
    if (!u){
        return { status: 204, data: null, message: '该用户不存在' };
    } else if (u.password !== p.password) {
        return { status: 204, data: null, message: '密码错误' };
    }
    return { status: 200, data: u, message: '登录成功' };
};
// 删除消息数据
const clearNews = (request) => {
    const p = JSON.parse(request.body);
    switch(p.type){
        case 'notice': msg.notice.length = 0;break;
        case 'message': msg.message.length = 0;break;
        case 'work': msg.work.length = 0;break;
    }
    return { status: 200, data: msg, total: msg.notice.length + msg.message.length + msg.work.length, message: '删除成功' };
};
// 添加新菜单
const addMenu = (request) => {
    const p = JSON.parse(request.body);
    console.log('添加：', p);
    p.id = ++id_sequence;
    menus.push(p);
    return { status: 200, data: menus, message: '添加成功' };
};
// 获取所有菜单
const getMenus = (request) => {
    return { status: 200, data: menus, message: 'success' };
};

/**
 * API拦截
 * **/
// 登录请求
Mock.mock('api/login', (params) => onLogin(params));
// 获取消息数据
Mock.mock('api/getnews', () => {return {status: 200, data: msg, total: msg.notice.length + msg.message.length + msg.work.length, message: 'success'};});
// 删除消息数据
Mock.mock('api/clearnews', (params) => clearNews(params));
// 获取消息总数
Mock.mock('api/getnewstotal', () => ({ status: 200, data: msg.notice.length + msg.message.length + msg.work.length, message: 'success' }));
// 添加菜单
Mock.mock('api/addmenu', (params) => addMenu(params));
// 获取所有菜单
Mock.mock('api/getmenus', (params) => getMenus(params));