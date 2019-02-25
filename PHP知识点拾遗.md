## php知识点拾遗

1 页面乱码的解决方法
 + 可在当前页面头部加入 header("content-type:text/html;charset=utf-8");
 + 修改php.ini 配置文件，即将default_chasrset改成如下 default_charset="UTF-8";

