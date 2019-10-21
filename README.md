# AG-Admin-v2-UI 
## 准备工作
- node.js环境（npm包管理器）
- vue-cli 脚手架构建工具
- cnpm  npm的淘宝镜像

## 开发运行
```bash
   
    # 安装依赖  
    cnpm install

    # 本地开发 开启服务
    npm run dev
```
浏览器访问 http://localhost:9527

## 发布
```bash
    # 发布测试环境 带webpack ananalyzer
    npm run build:sit-preview

    # 构建生成环境
    npm run build:prod
```
### 部署nginx配置参考
```
  location / {
        # 指向我们打包后上传的前端文件
        root /opt/nginx/dist;
        index index.html;
    }
    location /jwt/ {
        # 转发请求到后端服务网关
        proxy_pass http://127.0.0.1:8765/jwt/;
    }
    location /api/ {
        proxy_pass http://127.0.0.1:8765/api/;
     }
```

## 目录结构
```shell
├── build                      // 构建相关  
├── config                     // 配置相关
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 主题 字体等静态资源
│   ├── components             // 全局公用组件
│   ├── directive              // 全局指令
│   ├── filtres                // 全局filter
│   ├── mock                   // mock数据
│   ├── router                 // 路由
│   ├── store                  // 全局store管理
│   ├── styles                 // 全局样式
│   ├── utils                  // 全局公用方法
│   ├── view                   // view
│   ├── App.vue                // 入口页面
│   └── main.js                // 入口 加载组件 初始化等
├── static                     // 第三方不打包资源
│   ├── jquery
│   └── Tinymce                // 富文本
├── .babelrc                   // babel-loader 配置
├── eslintrc.js                // eslint 配置项
├── .gitignore                 // git 忽略项
├── favicon.ico                // favicon图标
├── index.html                 // html模板
└── package.json               // package.json

```


## 状态管理
后台只有user和app配置相关状态使用vuex存在全局，其它数据都由每个业务页面自己管理。

## 后台工程启动[Spring-Cloud-Admin][点击打开](https://github.com/396191970/Spring-Cloud-Admin)

## 功能截图
### 基本功能
![输入图片说明](https://images.gitee.com/uploads/images/2019/0528/205334_7a892d09_1899222.png "2.png")

![输入图片说明](https://images.gitee.com/uploads/images/2019/0528/205343_124202af_1899222.png "3.png")

![输入图片说明](https://images.gitee.com/uploads/images/2019/0528/205353_2fd7c93f_1899222.png "4.png")

![输入图片说明](https://images.gitee.com/uploads/images/2019/0528/205407_942a9540_1899222.png "5.png")

![输入图片说明](https://images.gitee.com/uploads/images/2019/0528/205420_01f6b933_1899222.png "6.png")

![输入图片说明](https://images.gitee.com/uploads/images/2019/0528/205429_5c7bb102_1899222.png "7.png")

![输入图片说明](https://images.gitee.com/uploads/images/2019/0528/205438_f1cd07c4_1899222.png "8.png")

![输入图片说明](https://images.gitee.com/uploads/images/2019/0528/205447_878d8a39_1899222.png "9.png")

![输入图片说明](https://images.gitee.com/uploads/images/2019/0528/205456_ec6fe29c_1899222.png "10.png")

![输入图片说明](https://images.gitee.com/uploads/images/2019/0528/205504_1ecaec42_1899222.png "11.png")

![输入图片说明](https://images.gitee.com/uploads/images/2019/0528/205514_27cd17dc_1899222.png "12.png")

![输入图片说明](https://images.gitee.com/uploads/images/2019/0528/205521_7379cb06_1899222.png "13.png")


## 添加功能
1. ace-generator 根据数据库生成curd 代码 http接口 和vue js 前端文件
1. 将生成的文件前端项目中
1. 管理系統配置菜单   菜单管理里面的路径编码对应router.js里面，资源路径可不填  
1. 管理系統配置按钮，资源   资源编码对应vue文件里面的  this.elements['shopGroupManager:btn_edit'];  资源地址随便填
1. 管理系统配置菜单到用户的授权
1. router\index.js 配置router


## bug
- 给用户分配全选，添加按钮资源，不能全选，只能每次点一个。


## select 组件调用后端服务
 
```text
        <el-form-item label="所属品牌" prop="shopGroupName">
          <el-select v-model="selectValue" filterable remote placeholder="请输入所属品牌关键词"
                     :remote-method="remoteMethod" :loading="loading" @change="selectChange">
            <el-option v-for="item in items" :key="item.id" :label="item.name" :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
```

```text
  import * as selectValue from 'api/partner/shopGroup/index';

```
```text
 selectValue: '',
  loading: false,
  items: [],
```
```text
 handleUpdate(row) {
        getObj(row.id)
          .then(response => {
            this.form = response.data;
            this.selectValue = response.data.shopGroupName;
            this.dialogFormVisible = true;
            this.dialogStatus = 'update';
          });
      },
```
```text
      ,remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          selectValue.page({
            name: query
          }).then(response => {
            this.items = response.data.rows;
            this.total = response.data.total;
            this.loading = false;
            console.info('total:' + this.total)
          });
        } else {
          this.items = [];
        }
      }
      ,selectChange(val) {
        console.info('selectChange');
        console.info(val);
        this.form.shopGroupId = val.id;
        this.form.shopGroupName = val.name;
        console.info(this.form);
      }
    
```