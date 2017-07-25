# gulp + vue2.0 开发活动页

## 技术栈
  gulp + vue2.0 + ES6 + scss + css3

## 运行环境
  * node：v8.0.0
  * npm:  v5.0.0

## 测试环境
  * sit 域名：h.jia.chexiangsit2.com
  * pre 域名：h.jia.chexiangpre.com
  * prd 域名：h.jia.chexiang.com

## 项目启动
  * git clone
  * npm install
  * gulp 本地开发
  * gulp sitbuild sit 环境测试
  * gulp prebuild pre 环境测试
  * gulp prdbuild prd 环境测试

## 工程目的
  * scss 编辑
  * ES6 编译
  * vue数据双向绑定和js模块化
  * 静态资源版本号控制

## 技术要点：
  * 暂无

## 项目结构
   ```.
    ├── gulptask                                         
    │   ├── clean.js                              
    │   ├── replacetpl.js                               
    │   ├── sass.js                              
    │   ├── scripts.js                              
    ├── static                                          
    │   ├── scss
    │   │   ├── base
    │   │   │   └── _reset.scss                
    │   │   ├── helper                                           
    │   │   │   └── _mixin.scss                
    │   │   ├── layout                                      
    │   │   │   └── header.scss                       
    │   │   │   └── footer.scss                        
    │   │   ├── components                                               
    │   │   │   └── swiper.scss                      
    │   │   ├── page
    │   │   │   └── home.scss                       
    │   │   └── common.scss
    ├── view
    │   ├── layout
    │   │   │   └── header.html
    │   │   │   └── footer.html
    │   ├── components
    │   ├── pages
    │   │   │   └── home.html
    │   ├── index.html
    └── index.html                                
    .
    ```

