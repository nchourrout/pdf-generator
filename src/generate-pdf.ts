import puppeteer, { PDFOptions, PaperFormat } from 'puppeteer';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

async function generatePDF(htmlContent: string, options: PDFOptions) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const pdfOptions: PDFOptions = {
    format: options.format || 'A4',
    margin: options.margin || { top: '2cm', right: '1cm', bottom: '2cm', left: '1cm' },
    path: options.path || 'output.pdf',
    printBackground: true,
  };

  await page.pdf(pdfOptions);

  await browser.close();
}

const argv = yargs(hideBin(process.argv))
  .option('html', {
    alias: 'h',
    description: 'HTML content to convert to PDF',
    type: 'string',
    demandOption: true,
  })
  .option('format', {
    alias: 'f',
    description: 'Page format',
    type: 'string',
    default: 'A4',
  })
  .option('marginTop', {
    description: 'Top margin',
    type: 'string',
    default: '2cm',
  })
  .option('marginRight', {
    description: 'Right margin',
    type: 'string',
    default: '1cm',
  })
  .option('marginBottom', {
    description: 'Bottom margin',
    type: 'string',
    default: '2cm',
  })
  .option('marginLeft', {
    description: 'Left margin',
    type: 'string',
    default: '1cm',
  })
  .option('path', {
    alias: 'p',
    description: 'Output file path',
    type: 'string',
    default: 'output.pdf',
  })
  .parseSync();

const margins = {
  top: argv.marginTop,
  right: argv.marginRight,
  bottom: argv.marginBottom,
  left: argv.marginLeft,
};

generatePDF(argv.html, { format: argv.format as PaperFormat, margin: margins, path: argv.path }).then(() => {
  console.log('PDF generated successfully!');
}).catch(err => {
  console.error('Error generating PDF:', err);
});
