module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    requireModule: ['ts-node/register'],
    require: ['src/support/**/*.ts', 'src/steps/**/*.ts'],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
      'junit:reports/cucumber-report.xml'
    ],
    formatOptions: { snippetInterface: 'async-await' },
    parallel: Number(process.env.WORKERS ?? 2),
    retry: Number(process.env.RETRIES ?? 0)
  }
};
