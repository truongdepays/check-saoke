const pdfParse = require('pdf-parse');
const fs = require('fs');
const parsePdf = async (pdfPath) => {
  const pdfBuffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(pdfBuffer);
  return data;
};

module.exports = {
  parsePdf,
};