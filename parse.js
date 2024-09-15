const { parsePdf } = require('./services/parse-pdf');
const { Client, Repository } = require('redis-om');
const { transactionSchema } = require('./schemas/transaction');
const pdfPath = './files/file.pdf';
const { client } = require('./config/redis');

const data = async () => {
  const data = await parsePdf(pdfPath);
  let dataText = data.text.replace(/\d{2}\/09\/\d{4}/g, (date) => {
    return '|' + date;
  });
  
  dataText = dataText.replace(/\n/g, ' ');
  // console.log(dataText);
  dataText = dataText.replace(/Page \d{0,5} of \d{0,5}/g, ' ');
  dataText = dataText.replace(/Telex.{0,325}S.R. VIETNAM/g, ' ');
  dataText = dataText.replace(/Ngày GD\/.{0,325}Transactions in detail/g, ' ');
  const rowPattern = /^(\d{2}\/\d{2}\/\d{4}) {0,5}(\d{0,4}\.\d{0,5}) {0,5}(\d{0,3}\.\d{0,3}\.\d{0,3}\.\d{0,3}|\d{0,3}\.\d{0,3}\.\d{0,3}|\d{0,3}\.\d{0,3})(.*)$/;
  const lines = dataText.split('|');
  // console.log(lines);
  const transactions = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(rowPattern);
    if (match) {
      transactions.push({
        date: match[1],
        code: match[2],
        balance: match[3],
        description: match[4].trim(),
      });
    }
  }
  // console.log(transactions[0]);
  await client.FLUSHDB()
  
  try {
    const repository = await new Repository(transactionSchema, client);
    await repository.createIndex();
    for (const transaction of transactions) {
      console.log(transaction.code);
      await repository.save(transaction);
    }
  } catch (error) {
    console.error('Error creating index:', error);
  }
  await client.disconnect();
};

data();
