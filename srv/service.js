const cds = require('@sap/cds');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { parse } = require('csv-parse/sync'); // CommonJS import

module.exports = cds.service.impl(async function () {

    // Utility: read CSV asynchronously (stream-based)
    const readCSV = (filePath) => new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (err) => reject(err));
    });

    // findTopSites (tab-separated)
    this.on('findTopSites', async req => {
        const { productId } = req.data;
        const mypath = path.join(__dirname, './data/findTopSites.csv');

        const fileContent = fs.readFileSync(mypath, 'utf8');
        const data = parse(fileContent, {
            columns: true,
            delimiter: '\t',
            skip_empty_lines: true
        });

        return productId ? data.filter(r => r.productId === productId) : data;
    });

    // checkStock
    this.on('checkStock', async req => {
        const { productId, site } = req.data;
        const checkStock_path = path.join(__dirname, './data/checkStock.csv');
        const data = await readCSV(checkStock_path);
        return data.find(r => r.productId === productId && r.site === site) || {};
    });

    // transportEstimate
    this.on('transportEstimate', async req => {
        const { source, dest } = req.data;
        const transportEstimate_path = path.join(__dirname, './data/transportEstimate.csv');
        const data = await readCSV(transportEstimate_path);
        return data.find(r => r.source === source && r.dest === dest) || {};
    });

    // requestTransfer
    this.on('requestTransfer', async req => {
        const requestTransfer_path = path.join(__dirname, './data/requestTransfer.csv');
        const data = await readCSV(requestTransfer_path);
        return data[0] || { transferId: `TRX-${Date.now()}`, status: 'PENDING_APPROVAL', approvers: ['mgr1','mgr2'] };
    });

    // pendingApprovals
    this.on('pendingApprovals', async req => {
        const { approverId } = req.data;
        const pendingApprovals_path = path.join(__dirname, './data/pendingApprovals.csv');
        const data = await readCSV(pendingApprovals_path);
        return data.filter(r => r.approverId === approverId);
    });

    // test action
    this.on('test', () => "Hello world!");
});
