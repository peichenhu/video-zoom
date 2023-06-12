import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const __dirname = path.resolve();
const filename = `video-zoom@${pkg.version}`;
const input = path.join(__dirname, 'dist');
const outputPath = path.join(__dirname, `release/${filename}.zip`);
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
    zlib: { level: 9 }, // 设置压缩级别
});

archive.on('error', function (err) {
    throw err;
});

output.on('close', function () {
    const size = (archive.pointer() / 1024).toFixed(0);
    console.log(chalk.gray('压缩完毕，大小:'), chalk.green(`${size} KB`), chalk.gray('路径:'), chalk.blue(outputPath));
});

archive.pipe(output);
archive.directory(input, filename);
archive.finalize();
