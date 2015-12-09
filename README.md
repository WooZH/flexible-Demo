#flexible-Demo

@for [w3cplus - 使用Flexible实现手淘H5页面的终端适配] (http://www.w3cplus.com/mobile/lib-flexible-for-html5-layout.html) 


> 配合gulp插件解决px -> rem 的转换

  <script src="http://g.tbcdn.cn/mtb/lib-flexible/{{version}}/??flexible_css.js,flexible.js"></script>

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

@exmaple
<pre>
.selector {
    width: 150px;
    height: 64px; /*px*/
    font-size: 28px; /*px*/
    border: 1px solid #ddd; /*no*/
}
</pre>
@**px2rem**处理之后将会变成：(插件有点小问题，当css用标签名定义font-size的时候会被编译rem单位)
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
