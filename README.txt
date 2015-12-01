Проект Motivis

Менеджер: Александра Резанович
Тим-лид: Денис Бабань

git: https://github.com/syncopetwice/MTVS


gulp стартуй в корне
браузерные префиксы расставлять не надо

сайт поддерживает цветовые темы, которые лежат в папке scss/themes

есть много разных оргов, в основном разработку я вел на Motivis QA Dev (https://login.salesforce.com/?un=denis.baban@spdev.com&pw=password9)

чтобы попасть на комьюнити - логинимся на орге -> all communities -> переходишь по url

https://starterpack4-developer-edition.ap2.force.com/studentcommunity/ (адрес вот такой делаешь)

но если надо поработать у кого-то конкретного на орге, они дадут доступ
статики везде общие

минифицированный -> gulpfile.js

gulp.task('scss', function () {
	return scss('./scss/app/app.styles.scss', {
		style: 'compact' <=================================== "expanded" | "compressed"
	})
		.pipe(plumber())
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'ie >= 8'],
			cascade: false
		}))
		.pipe(gulp.dest('assets/css/app/'));
});