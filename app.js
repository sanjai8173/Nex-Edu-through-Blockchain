const express = require('express');
const { spawn } = require('child_process');
const app = express();
const cors = require('cors');
const Student = require('./models/student.js')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
app.use(express.json());
app.use(cors())
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://SANJAIGANDHI:0000@cluster0.huotgpz.mongodb.net/NexEdu?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

app.post('/executeActions', async (req, res) => {
  const {
    senderRegNo,
    senderName,
    senderAccountNo,
    receiverRegNo,
    receiverName,
    receiverAccountNo,
    amount,
    description,
    feeId,
    registerNumber,
    feeIdToPay,
  } = req.body;

  // Step 1: Add Bill
  const addBillProcess = spawn('truffle', [
    'exec',
    'scripts/addBill.js',
    senderRegNo,
    senderName,
    senderAccountNo,
    receiverRegNo,
    receiverName,
    receiverAccountNo,
    amount.toString(),
    description,
    feeId.toString(),
  ]);

  let addBillResponse = '';

  addBillProcess.stdout.on('data', (output) => {
    addBillResponse = output.toString(); // Capture the response
  });

  addBillProcess.on('close', (code) => {
    console.log(`addBill process exited with code ${code}`);
    
    // Step 2: Pay Fee
    const payFeeProcess = spawn('truffle', [
      'exec',
      'scripts/payFee.js',
      registerNumber,
      feeIdToPay.toString(),
    ]);

    let payFeeResponse = '';

    payFeeProcess.stdout.on('data', (output) => {
      payFeeResponse = output.toString(); // Capture the response
    });

    payFeeProcess.on('close', (code) => {
      console.log(`payFee process exited with code ${code}`);
      
      res.json({
        addBillResponse: addBillResponse,
        payFeeResponse: payFeeResponse
      });
    });
  });
});



app.get('/getStudentInfo/:registerNumber', async (req, res) => {
  const regno = req.params.registerNumber;

  const retrieveStudProcess = spawn('truffle', ['exec', 'scripts/getStudentInfo.js', regno]);

  let retrieveStudResponse = '';

  retrieveStudProcess.stdout.on('data', (output) => {
    retrieveStudResponse = output.toString(); // Capture the response
  });

  retrieveStudProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    res.status(500).send('Error retrieving Student Record');
  });

  retrieveStudProcess.on('close', async (code) => {
    console.log(`retrieveStudent process exited with code ${code}`);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(retrieveStudResponse); // Attempt to parse the response
    } catch (error) {
      console.error('Error parsing response:', error);
      return res.status(500).send('Error parsing response');
    }

    console.log("Retrieve Student response:", parsedResponse);

    const paidFeesArray = parsedResponse.paidFees;

    const retrieveBillsProcess = spawn('truffle', ['exec', 'scripts/retrieveBills.js', ...paidFeesArray]);

    let retrieveBillsResponse = '';

    retrieveBillsProcess.stdout.on('data', (output) => {
      retrieveBillsResponse = output.toString(); // Capture the response
    });

    retrieveBillsProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      res.status(500).send('Error retrieving Bills');
    });

    retrieveBillsProcess.on('close', (code) => {
      console.log(`retrieveBills process exited with code ${code}`);

      let parsedBillsResponse;
      try {
        parsedBillsResponse = JSON.parse(retrieveBillsResponse); // Attempt to parse the response
      } catch (error) {
        console.error('Error parsing bills response:', error);
        return res.status(500).send('Error parsing Bills response');
      }

      console.log("Retrieve Bills response:", parsedBillsResponse);

      // Retrieve all fees using 'retrieveAllFee.js' script
      const retrieveAllFeesProcess = spawn('truffle', ['exec', 'scripts/retrieveAllFee.js']);

      let retrieveAllFeesResponse = '';

      retrieveAllFeesProcess.stdout.on('data', (output) => {
        retrieveAllFeesResponse = output.toString(); // Capture the response
      });

      retrieveAllFeesProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.status(500).send('Error retrieving all fees');
      });

      retrieveAllFeesProcess.on('close', async (code) => {
        console.log(`retrieveAllFees process exited with code ${code}`);

        let allFeesResponse;
        try {
          allFeesResponse = JSON.parse(retrieveAllFeesResponse); // Attempt to parse the response
        } catch (error) {
          console.error('Error parsing all fees response:', error);
          return res.status(500).send('Error parsing All Fees response');
        }

        console.log("Retrieve All Fees response:", allFeesResponse);

        // Compare all fees with paid fees to find unpaid fees
        const unpaidFees = allFeesResponse.filter(fee => !paidFeesArray.includes(fee.feeId.toString()));

        // Combine the student information, paid fees, and unpaid fees
        const combinedResponse = {
          studentInfo: parsedResponse,
          paidBills: parsedBillsResponse,
          unpaidFees: unpaidFees
        };

        res.json(combinedResponse); // Send the combined response
      });
    });
  });
});




// Add these routes below your existing '/addfee' route
app.get('/getStudentInfo1/:registerNumber', async (req, res) => {
  const regno = req.params.registerNumber;

  const retrieveStudProcess = spawn('truffle', ['exec', 'scripts/getStudentInfo.js', regno]);

  let retrieveStudResponse = '';

  retrieveStudProcess.stdout.on('data', (output) => {
    retrieveStudResponse = output.toString(); // Capture the response
  });

  retrieveStudProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    res.status(500).send('Error retrieving Student Record');
  });

  retrieveStudProcess.on('close', async (code) => {
    console.log(`retrieveStudent process exited with code ${code}`);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(retrieveStudResponse); // Attempt to parse the response
    } catch (error) {
      console.error('Error parsing response:', error);
      return res.status(500).send('Error parsing response');
    }

    console.log("Retrieve Student response:", parsedResponse);

    const paidFeesArray = parsedResponse.paidFees;

    const retrieveBillsProcess = spawn('truffle', ['exec', 'scripts/retrieveBills.js', ...paidFeesArray]);

    let retrieveBillsResponse = '';

    retrieveBillsProcess.stdout.on('data', (output) => {
      retrieveBillsResponse = output.toString(); // Capture the response
    });

    retrieveBillsProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      res.status(500).send('Error retrieving Student Record');
    });

    retrieveBillsProcess.on('close', (code) => {
      console.log(`retrieveBills process exited with code ${code}`);

      let parsedBillsResponse;
      try {
        parsedBillsResponse = JSON.parse(retrieveBillsResponse); // Attempt to parse the response
      } catch (error) {
        console.error('Error parsing response:', error);
        return res.status(500).send('Error parsing response');
      }

      console.log("Retrieve Bills response:", parsedBillsResponse);

      // Combine the student information and bill information
      const combinedResponse = {
        studentInfo: parsedResponse,
        billsInfo: parsedBillsResponse
      };

      res.json(combinedResponse); // Send the combined response
    });
  });
});

app.get('/retrievefee/:feeId', (req, res) => {
  const feeId = req.params.feeId;

  const retrieveFeeProcess = spawn('truffle', ['exec', 'scripts/retrieveFee.js', feeId]);

  let retrieveFeeResponse = '';

  retrieveFeeProcess.stdout.on('data', (output) => {
    retrieveFeeResponse = output.toString(); // Capture the response
  });

  retrieveFeeProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    res.status(500).send('Error retrieving fee');
  });

  retrieveFeeProcess.on('close', (code) => {
    console.log(`retrieveFee process exited with code ${code}`);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(retrieveFeeResponse); // Attempt to parse the response
    } catch (error) {
      console.error('Error parsing response:', error);
      return res.status(500).send('Error parsing response');
    }

    console.log("Retrieve fee response:", parsedResponse);

    res.json(parsedResponse); // Send the parsed JSON response
  });
});

app.get('/retrieveallfees', (req, res) => {
  const retrieveAllFeesProcess = spawn('truffle', ['exec', 'scripts/retrieveAllFee.js']);

  let retrieveAllFeesResponse = '';

  retrieveAllFeesProcess.stdout.on('data', (output) => {
    retrieveAllFeesResponse = output.toString(); // Capture the response
  });

  retrieveAllFeesProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    res.status(500).send('Error retrieving all fees');
  });

  retrieveAllFeesProcess.on('close', (code) => {
    console.log(`retrieveAllFees process exited with code ${code}`);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(retrieveAllFeesResponse); // Attempt to parse the response
    } catch (error) {
      console.error('Error parsing response:', error);
      return res.status(500).send('Error parsing response');
    }

    console.log("Retrieve all fees response:", parsedResponse);

    res.json(parsedResponse); // Send the parsed JSON response
  });
});


app.post('/addevent', (req, res) => {
  // Extract event details from the request body
  const eventName = req.body.eventName;
  const totalParticipants = req.body.totalParticipants;
  const eventDescription = req.body.eventDescription;
  const eventType = req.body.eventType;
  const department = req.body.department;

  // Spawn a child process to run the Truffle script for adding events
  const addEventProcess = spawn('truffle', ['exec', 'scripts/addEvent.js', eventName, totalParticipants, eventDescription, eventType, department]);

  let addEventResponse = ''; // To capture the response

  // Event listener for process outputs (stdout)
  addEventProcess.stdout.on('data', (output) => {
    addEventResponse = output.toString(); // Capture the response
  });

  // Event listener for process errors (stderr)
  addEventProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    res.status(500).send('Error adding event');
  });

  // Event listener for process close event
  addEventProcess.on('close', (code) => {
    console.log(`addEvent process exited with code ${code}`);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(addEventResponse); // Attempt to parse the response
    } catch (error) {
      console.error('Error parsing response:', error);
      return res.status(500).send('Error parsing response');
    }

    console.log("Add event response:", parsedResponse);

    res.json(parsedResponse); // Send the parsed JSON response
  });
});

app.get('/getallevents', (req, res) => {
  // Spawn a child process to run the Truffle script for retrieving all events
  const getAllEventsProcess = spawn('truffle', ['exec', 'scripts/retrieveAllEvents.js']);

  let getAllEventsResponse = ''; // To capture the response

  // Event listener for process outputs (stdout)
  getAllEventsProcess.stdout.on('data', (output) => {
    getAllEventsResponse = output.toString(); // Capture the response
  });

  // Event listener for process errors (stderr)
  getAllEventsProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    res.status(500).send('Error retrieving all events');
  });

  // Event listener for process close event
  getAllEventsProcess.on('close', (code) => {
    console.log(`getAllEvents process exited with code ${code}`);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(getAllEventsResponse); // Attempt to parse the response
    } catch (error) {
      console.error('Error parsing response:', error);
      return res.status(500).send('Error parsing response');
    }

    console.log("Get all events response:", parsedResponse);

    res.json(parsedResponse); // Send the parsed JSON response
  });
});


app.post('/addfee', (req, res) => {
  const feeId = req.body.feeId;
  const title = req.body.title;
  const description = req.body.description;
  const amount = req.body.amount;
  const deadline = req.body.deadline;
  const studentType = req.body.studentType;
  const feeType = req.body.feeType;

  const addFeeProcess = spawn('truffle', ['exec', 'scripts/addFee.js', feeId, title, description, amount, deadline, studentType, feeType]);

  let addFeeResponse = '';

  addFeeProcess.stdout.on('data', (output) => {
    addFeeResponse = output.toString(); // Capture the response
  });

  addFeeProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    res.status(500).send('Error adding fee');
  });

  addFeeProcess.on('close', (code) => {
    console.log(`addFee process exited with code ${code}`);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(addFeeResponse); // Attempt to parse the response
    } catch (error) {
      console.error('Error parsing response:', error);
      return res.status(500).send('Error parsing response');
    }

    console.log("Add fee response:", parsedResponse);

    res.json(parsedResponse); // Send the parsed JSON response
  });
});

app.post('/register-student', async (req, res) => {
  const { registerNumber, name, department, studentType, studentEmail, studentPassword } = req.body;

  const truffleExec = spawn('truffle', ['exec', 'scripts/addStudent.js', registerNumber, name, department, studentType]);

  truffleExec.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  truffleExec.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  truffleExec.on('close', async (code) => {
    if (code === 0) {
      try {
        const newStudent = new Student({
          email: studentEmail,
          password: studentPassword,
        });

        await newStudent.save(); // Wait for the save operation to complete

        console.log('Student saved successfully');
        res.status(200).json({ message: 'Student added successfully' });
      } catch (error) {
        console.error('Error saving student:', error);
        res.status(200);
      }
    } else {
      res.status(400).json({ message: 'Student already exists or an error occurred' });
    }
  });
});
const port = 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
