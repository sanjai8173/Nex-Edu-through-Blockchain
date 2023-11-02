const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 3000;

app.get('/getBill/:regNo/:billNo', async (req, res) => {
  const regNo = req.params.regNo; // Get registration number from the route parameter
  const billNo = parseInt(req.params.billNo); // Get bill number from the route parameter

  const getBillProcess = spawn('truffle', [
    'exec',
    'scripts/getBill.js',
    regNo, // Pass registration number as the first argument
    billNo.toString(), // Pass bill number as the second argument
  ]);

  let getBillResponse = '';

  getBillProcess.stdout.on('data', (output) => {
    getBillResponse = output.toString(); // Capture the response
  });

  getBillProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    res.status(500).send('Error getting bill');
  });

  getBillProcess.on('close', (code) => {
    console.log(`getBill process exited with code ${code}`);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(getBillResponse); // Attempt to parse the response
    } catch (error) {
      console.error('Error parsing response:', error);
      return res.status(500).send('Error parsing response');
    }

    console.log("Get Bill response:", parsedResponse);

    res.json(parsedResponse); // Send the parsed response
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
