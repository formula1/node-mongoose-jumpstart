Installing Web Assets (JS/CSS)
==

* All assets are installed by bower. 
* All bower assets are installed to "bower_components" directory, and you can refer them in html, using path 'bower_components/path/to/your/asset'.
* If the asset is not available in bower, then download and save them to /public/js and /public/css folder and refer them in html. 
* 'bower_components' is not commited to git, so after git clone / git pull, install all bower dependencies by command "npm install" (which will automatically call "bower intall" to install all bower dependencies )

Foundation Framework
==

* Foundataion framework is installed using bower, and its available in folder '/bower_components/foundation'
* If you editing any global properties (font, body background, button color), then edit /public/css/settings.scss
* If you want to add some styles to specific document. Then declare appropriate class name and ids and declare styles in /public/css/style.scss
* You can also new scss files, after adding import them in /public/css/style.scss.
* Use command "gulp sass" to compile all scss files to /public/css/style.css.
* Use command "gulp watch" to conintiously watch and convert scss files.

Production Deployment
==

* During production deployment, all css / js files are combined using  gulp-useref.
* So when when add new reference in head.blade, always declare local assets inside build block &lt;!-- build -->  &lt;!-- endbuild -->.
* gulp-useref will combine all files inside build block into one.
* If you have external dependency from different domain, declare it outside build block.

