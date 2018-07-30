var gulp = require('gulp');
//加载gulp-load-plugins插件，并马上运行它
var plugins = require('gulp-load-plugins')();
//或是：
//var gulpLoadPlugins = require('gulp-load-plugins');
//var plugins = gulpLoadPlugins();

var path = {

	//
	Dist: 'app/dist/', 			//发布根目录
	Src: "app/client/", 	//开发根目录

	// css 
	cssPath: 'app/client/css/', // 开发目录 css
	cssDist: 'app/dist/css',

	// js
	jsPath: 'app/client/js/',
	jsDist: 'app/dist/js/',

	// sass
	sassPath: 'app/client/css/',
	sassDist: 'app/dist/css/',

	// html
	htmlPath: 'app/client/html/',
	htmlDist: 'app/dist/html/',

	//img
	imgPath: 'app/client/images/',
	imgDist: 'app/dist/images/'
};

//创建一个名为js的任务
gulp.task('js', function(){
  // 首先取得app/static/scripts下的所有为.js的文件（**/的意思是包含所有子文件夹)
  return gulp.src(path.jsPath + '**/*.js')
    //错误管理模块（有错误时会自动输出提示到终端上）
    .pipe(plugins.plumber())
    //合并同一目录下的所有文件,并将合并的目录名作为合并后的文件名
    .pipe(plugins.concatDir({ext: '.min.js'}))
    //js压缩
    .pipe(plugins.uglify())
    //将合并压缩后的文件输出到dist/static/scripts下（假如没有dist目录则自动生成dist目录）
    .pipe(gulp.dest(path.jsDist))
});



// sass
gulp.task('sass', function() { 
  return gulp.src([path.sassPath + '*.scss', path.sassPath + '*/*.scss'])
    .pipe(plugins.sass({ outputStyle: 'compact' }).on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest(path.sassDist))
    .pipe(plugins.rename({ suffix: '.min' }))
    .pipe(plugins.minifyCss())
    .pipe(gulp.dest(path.sassDist))
    .pipe(plugins.notify({ message: 'Styles task complete' }));
});


//创建一个名为images的任务
gulp.task('images', function(){
  // 首先取得app/static/images下的所有为.{png,jpg,jpeg,ico,gif,svg}后缀的图片文件（**/的意思是包含所有子文件夹)
  return gulp.src([path.imgPath + '**/*.{png,jpg,jpeg,ico,gif,svg}', path.imgPath + '*.{png,jpg,jpeg,ico,gif,svg}'])
    //错误管理模块（有错误时会自动输出提示到终端上）
    .pipe(plugins.plumber())
    .pipe(plugins.imagemin({
      optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
      progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
      interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
      multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
    }))
    //将压缩后的图片输出到dist/static/images下（假如没有dist目录则自动生成dist目录）
    .pipe(gulp.dest(path.imgDist))
});


gulp.task( 'htmlmin', function()
{
	var options = {
		collapseWhitespace: true,                                   //压缩HTML
		collapseBooleanAttributes: false,                           //省略布尔属性的值 <input checked="true"/> ==> <input />
		removeEmptyAttributes: true,                                //删除所有空格作属性值 <input id="" /> ==> <input />
		removeScriptTypeAttributes: true,                           //删除<script>的type="text/javascript"
		removeStyleLinkTypeAttributes: true,                        //删除<style>和<link>的type="text/css"
		minifyJS: true,                                             //压缩页面JS
		minifyCSS: true                                             //压缩页面CSS
	};
	return gulp.src( [path.htmlPath + '*.html', path.htmlPath + '*/*.html'] )
		.pipe( plugins.htmlmin( options ) )
		//.pipe(plugins.useref({ searchPath: '.tmp' }))
		/* 更改html 引用路径：css/js文件的后缀名 */
		.pipe( plugins.replace( '.css"', '.min.css"' ) )
		.pipe( plugins.replace( '.js"', '.min.js"' ) )
		.pipe( plugins.htmlmin( { collapseWhitespace: true } ) )
 
		.pipe( gulp.dest( path.htmlDist ) )
});

// 删除 生成文件
gulp.task('cleanDist', function () {
	return gulp.src( path.Dist + '*', {read: false} )
	.pipe(plugins.clean())
});

//创建一个名为redist的任务
gulp.task('redist', function(){
  //先运行clean，然后并行运行html,js,less,images,watch
  //如果不使用gulp-run-sequence插件的话，由于gulp是并行执行的
  //有可能会出现一种情况（其他文件处理速度快的已经处理完了，然后clean最后才执行，会把前面处理完的文件删掉，所以要用到runSequence）
  plugins.runSequence('cleanDist', ['js', 'sass', 'images', 'htmlmin'])
})

//创建一个名为default的任务（上面的任务都可以没有，但是这个任务必须有，不然在终端执行gulp命令会报错）
//在终端上输入gulp命令，会默认执行default任务，并执行redist任务
gulp.task('default', ['redist']);




















