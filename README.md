#flexible-Demo
@exmaple [example](http://static.dface.cn/flexible-Demo/dest/demo.html)简单的`demo` <a herf="http://static.dface.cn/flexible-Demo/dest/demo.html" target="_blank">dd</a>

##完整引用举例：

    <script src="http://g.tbcdn.cn/mtb/lib-flexible/0.3.4/??flexible_css.js,flexible.js"></script>

##flexible的实质
`flexible`实际上就是通过`JS`来动态改写`meta`标签，`html`&`body`的`font-size`的值；`html`多了`data-dpr`来现实不同设备下文字用`px`来定义字号，这样能免去`@media`定义N多判断解决文字大小的问题。(此处对于一站式响应的项目会有小坑，在iPad下`dpr`会为`1`会出现字号很小的情况，就看取舍。)

##gulp插件配合
> 配合`gulp`插件解决`px` -> `rem` 的转换

<pre>
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var px2rem = require('postcss-px2rem');
gulp.task('default', function() {
    var processors = [px2rem({remUnit: 75})];
    return gulp.src('./src/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./dest'));
});
</pre>

>@exmaple

<pre>
.selector {
    width: 150px;
    height: 64px; /*px*/
    font-size: 28px; /*px*/
    border: 1px solid #ddd; /*no*/
}
</pre>

>@**px2rem**处理之后将会变成：(插件有点小问题，当`css`用标签名定义`font-size`的时候会被编译为`rem`单位)

<pre>
.selector {
    width: 2rem;
    border: 1px solid #ddd;
}
[data-dpr="1"] .selector {
    height: 32px;
    font-size: 14px;
}
[data-dpr="2"] .selector {
    height: 64px;
    font-size: 28px;
}
[data-dpr="3"] .selector {
    height: 96px;
    font-size: 42px;
}
</pre>

##官方 [lib.flexible](https://github.com/amfe/lib-flexible)
移动端自适应方案

##w3cplus 博客
@for [w3cplus - 使用Flexible实现手淘H5页面的终端适配] (http://www.w3cplus.com/mobile/lib-flexible-for-html5-layout.html) 
