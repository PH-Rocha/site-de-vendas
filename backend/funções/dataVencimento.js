const { format, addDays } = require('date-fins');

function dataVencimento () {
  let data = new Date();
  let vencimento = addDays(data, 1);
  return format(vencimento, "yyyy-mm-dd");
};

module.exports = dataVencimento;

