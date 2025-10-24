const cds = require('@sap/cds');
const fs = require('fs');
const csv = require('csv-parser');

module.exports = cds.service.impl(async function () {

    const readCSV = (filePath) => new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (err) => reject(err));
    });

    // Correct: bind action directly by its name
    this.on('findTopSites', async req => {
        const { productId } = req.data;
        const data = await readCSV('./data/findTopSites.csv');
        return productId ? data.filter(r => r.productId === productId) : data;
    });

    this.on('checkStock', async req => {
        const { productId, site } = req.data;
        const data = await readCSV('./data/checkStock.csv');
        return data.find(r => r.productId === productId && r.site === site) || {};
    });

    this.on('transportEstimate', async req => {
        const { source, dest } = req.data;
        const data = await readCSV('./data/transportEstimate.csv');
        return data.find(r => r.source === source && r.dest === dest) || {};
    });

    this.on('requestTransfer', async req => {
        const data = await readCSV('./data/requestTransfer.csv');
        return data[0] || { transferId:`TRX-${Date.now()}`, status:'PENDING_APPROVAL', approvers:['mgr1','mgr2'] };
    });

    this.on('pendingApprovals', async req => {
        const { approverId } = req.data;
        const data = await readCSV('./data/pendingApprovals.csv');
        return data.filter(r => r.approverId === approverId);
    });

});
