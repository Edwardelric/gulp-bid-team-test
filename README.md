# gulp + zepto + sui开发活动页

## 技术栈
  * gulp
  * scss
  * sui(http://m.sui.taobao.org/) 
  * zepto

## 运行环境
  * node：v8.0.0
  * npm:  v5.0.0

## 项目启动与打包
  * git clone
  * npm install
  * gulp 【启动项目】
  * gulp 命令自动生成的文件
     * static/styles 【编译后的css文件】
     * view_temp/活动名称   【编译后的html文件】
  * gulp build 【打包项目】
     * 生成dist文件

## 开发前准备
  * 唯一需要开发者手动修改的文件：config/index.js
  * <pre>
        module.exports =  {
            gulpHdName: '20170629hd',              // 活动名称
            gulpCategory: {
                'index':  '测试首页内容',          //  index 是页面的名称， 活动标题 是 idnex.html 的title, value是标题
                'detail': '测试详情内容',          //  key 名称就是新建的页面名称  detail => detail.html
                'list': '测试列表内容'             //  list 名称就是新建的页面名称  list => list.html
            }
        };
     </pre> 
  * 开发者clone项目后 请不要提交 修改的config文件 
  * 其他scss 和 js 按照各自需求创建，但名称必须和gulpHdName一致
  * gulpfile.js 里 browser-sync task middleware中间键里面可以配置proxy地址
     
## 统一规范 
  * 文件名称统一使用 _ 下划线的形式命名;
  * css 名称统一用 - 中划线形式命名;
  * id  名称统一用 驼峰式命名;
  * images 名称统一用 - 命名
  
## eslint 规范
  * 缩进4个空格 "indent": ["error", 4, {"SwitchCase": 1}];
  * 单引号规范  "quotes": ["error", "single"];
  * 必须写分号  "semi": ["error", "always"];
  * 数组定义规范 var arr = ['1', '2', '3'] 每列前加面加空格;
  * 对象定义规范 var obj = {'key1': 'val1', 'key': 'val2] 每列前加面加空格;
  * 函数定义规则 function a() {}  花括号前加空格
  * for循环规则  for (var i = 0; i < 10; i++) {}
  * “==”替换为 “===”        
     
## 项目结构
   ```.
    ├── config    
    │   └── index.js                                // 活动的名称和标题配置文件
    ├── gulptask    
    │   └── index.js                                // gulp 文件入口
    ├── gulptask                                         
    │   ├── clean.js                                // 清空已编译的文件
    │   ├── html.js                                 // html编译
    │   ├── images.js                               // 图片压缩
    │   ├── sass.js                                 // sass编译和压缩
    │   └── scripts.js                              // scripts编译和压缩
    ├── static                                          
    │   ├── images                                  // 图片资源
    │   │   ├── common                              // 公用的图片                        
    │   │   │   ├── backtop.png 
    │   │   │   ├── download-icon-btn.png
    │   │   │   ├── download-icon-chexiang.png
    │   │   │   ├── download-icon-close.png
    │   │   │   └── share.png
    │   │   ├── hd_20170629                         // 当前开发活动的图片
    │   │   │   └── bg-0.png
    │   ├── plugins                                 // 常用固定不变的组件
    │   │   ├── sm                                  
    │   │   │   ├── sm.min.css
    │   │   │   └── sm.min.js
    │   │   ├── url.min.js
    │   │   └── vue.min.js
    │   │   └── vue-resource.min.js
    │   ├── scripts                                 
    │   │   ├── hd_20170612                          // 当前开发活动的脚本
    │   │   │   └── index.js                        
    │   │   └── common.js                            // 公用脚本
    │   ├── scss
    │   │   ├── base
    │   │   │   └── _reset.scss                     // reset样式  
    │   │   ├── common                                           
    │   │   │   └── _common.scss                    // 公用的样式
    │   │   ├── hd_20170612                                      
    │   │   │   └── index.scss                      // 当前活动的样式                           
    │   │   ├── helpers                                               
    │   │   │   └── _mixins.scss                    // mixins                      
    │   │   └── main.scss                           // main 
    ├── view
    │   ├── hd_20170612                             
    │   │   │   └── index.html                      // 当前开发活动的中间内容页
    │   ├── hd_20170612_temp                       
    │   │   │   └── index.html                      // 动态生成的有link 和script 和分享的完整页
    │   ├── layout                                  
    │   │   │   ├── index.html                      // 统一套用的模板页面
    │   │   │   ├── links.html                      // 样式link页面  
    │   │   │   ├── scripts.html                    // 脚本script页面
    │   │   │   └── tools.html                      // 分享，返回顶部，下载app工具栏   
    .
    ```

