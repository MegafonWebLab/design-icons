const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');

function findFiles(dir) {
    return fs.readdirSync(dir)
        .reduce((files, file) => {
            return fs.statSync(path.join(dir, file)).isDirectory()
                ? files.concat(findFiles(path.join(dir, file)))
                : files.concat(path.join(dir, file));
        }, []);
}

function makePrintFriendly(s) {
    return s.replace('-', ' ')
        .replace('+', ' ')
        .replace('_', ' ')
        .replace('-', ' ')
        .replace('-', ' ')
        .replace('_', ' ');
}

/*
Category/Dimension/icon.svg
Category/Dimension/icon_dimension.svg
Category/icon_dimension.svg
Category/icon.svg
 */
function parsePath(p) {
    const [ category, ...rest ] = p.split('/');
    let iconName = rest[rest.length - 1];
    iconName = path.basename(iconName, '.svg');

    let size;
    let name;
    let sizeless = false;

    switch (rest.length) {
        // we have either (Category/)Dimension/icon.svg or (Category/)Dimension/icon_dimension.svg
        case 2:
            size = rest[0];
            name = makePrintFriendly(iconName.replace(new RegExp(`_${rest[0]}$`), ''));
            break;

        case 1:
            const icon = iconName.split('_');
            const maybeSize = Number(icon[icon.length - 1]);

            if (!isNaN(maybeSize)) {
                size = maybeSize;
                icon.pop();
                name = makePrintFriendly(icon.join(' '));
            } else {
                size = 36;
                sizeless = true;
                name = makePrintFriendly(icon.join(' '));
            }

            break;
    }

    return {
        category: makePrintFriendly(category),
        size,
        name,
        sizeless
    };
}

function build() {
    const categories = findFiles('./public/icons')
        .filter(f => f.match(/\.svg$/))
        .map(f => f.replace('public/icons/', ''))
        .reduce((categories, fullPath) => {
            const { category, size, name, sizeless } = parsePath(fullPath);
            categories[category] = categories[category] || {};

            if (!categories[category][name]) {
                categories[category][name] = categories[category][name] || {
                    name,
                    sizeless,
                    sizes: [{ size, fullPath }]
                };
            } else {
                categories[category][name].sizes.push({ size, fullPath });
                categories[category][name].sizes.sort((a, b) => a.size - b.size);
            }

            return categories;
        }, {});

    return gulp.src('./assets/template/index.ejs')
        .pipe(ejs({ categories }))
        .pipe(rename({ extname: '.html' }))
        .pipe(gulp.dest('./public'));
}

function watch() {
    gulp.watch('assets/template/*.ejs', build);
}

exports.default = build;
exports.watch = gulp.series(
    build,
    watch
);
