const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid')
const app = express();
app.use(bodyParser.json());
const port = 8090;
const { mergePartnersData, readConsolidateDataFromFile, writeConsolidateDataToFile, isAllowedToAddData, isAllowedToEditData, isAllowedToDeleteData } = require('./utils');

// Middleware to extract user role from headers
app.use((req, res, next) => {
  req.user = {
    role: req.headers['x-user-role'] || 'Viewer', // Default to 'Viewer' if not provided
  };
  next();
});

// we can pass multiple partner data in array then data will store in consolidateData.json and also can get value in varaiable.
async function main() {
    let partner1DataURL = "https://run.mocky.io/v3/85f33053-b7d2-4d49-8e94-694f8d335a4f";
    let partner2DataURL = "https://run.mocky.io/v3/48314576-ff23-405f-a8fa-d6643fa7d06e";
    const partnerData = [partner1DataURL, partner2DataURL];
    const con_data = await mergePartnersData(partnerData);
    
    // Now you can use con_data here
    //console.log(con_data);
  }
main();
    
  // Fetch Consolidated Data
  app.get('/fetch-consolidateData', async function (req, res) {
    try {
      let con_data = readConsolidateDataFromFile();
      res.status(200).json(con_data);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  // New API endpoint for access control based on role (Admin/Editor/Viewer)
  app.get('/consolidate/:role', async function (req, res) {
    try {
      let con_data = readConsolidateDataFromFile();
  
      const role = req.params.role;
  
      // Assuming 'access_control' is a field in your data
      const roleAttributesList = con_data.map(item => {
        const accessControlData = item.access_control;
  
        // Check if the specified role exists in the access control data
        if (accessControlData.hasOwnProperty(role)) {
          const roleAttributes = accessControlData[role].reduce((result, attribute) => {
            if (item.hasOwnProperty(attribute)) {
              result[attribute] = item[attribute];
            }
            return result;
          }, {});
  
          return { title: item.title, release_date: item.release_date, ...roleAttributes };
        } else {
          // Return null for items without the specified role or with no attributes
          return null;
        }
      }).filter(item => item !== null); // Remove null items from the result
  
      res.status(200).json(roleAttributesList);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error: " + error.message });
    }
  });


  // REST API endpoint to get data by ID
  app.get('/consolidate/:id', (req, res) => {
    try {
      const id = req.params.id;
      const consolidateData = readConsolidateDataFromFile();
  
      console.log('Requested ID:', id);
      console.log('Consolidate Data IDs:', consolidateData.map(item => item.id));
  
      const dataById = consolidateData.find(item => String(item.id) === String(id));
  
      if (dataById) {
        res.json(dataById);
      } else {
        res.status(404).json({ error: 'Data not found' });
      }
    } catch (error) {
      console.error('Error in /consolidate/:id endpoint:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  // Add new data
  app.post('/consolidate', (req, res) => {
    const newData = req.body;
    const consolidateData = readConsolidateDataFromFile();
  
    // Add a unique id to the new data
    const newDataWithId = { id: uuidv4(), ...newData };
  
    // Check if the user has the required role (e.g., Admin or Editor) to add data
    if (isAllowedToAddData(req.user.role)) {
      consolidateData.push(newDataWithId);
  
      // Write the updated consolidateData to the file
      writeConsolidateDataToFile(consolidateData);
  
      res.json({ message: 'Data added successfully', newData: newDataWithId });
    } else {
      res.status(403).json({ error: 'Permission denied' });
    }
  });
  
  // Edit data
  app.put('/consolidate/:id', (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    const consolidateData = readConsolidateDataFromFile();
  
   // Check if the user has the required role (e.g., Admin or Editor) to edit data
      if (isAllowedToEditData(req.user.role)) {
        const index = consolidateData.findIndex(item => item.id === id);
        if (index !== -1) {
          consolidateData[index] = { ...consolidateData[index], ...updatedData };
          writeConsolidateDataToFile(consolidateData);
          res.json({ message: 'Data updated successfully' });
        } else {
          res.status(404).json({ error: 'Data not found' });
        }
      } else {
        res.status(403).json({ error: 'Permission denied' });
      }
  });
  
  // Delete data
  app.delete('/consolidate/:id', (req, res) => {
    const id = req.params.id;
    const consolidateData = readConsolidateDataFromFile();
  
    // Check if the user has the required role (e.g., Admin) to delete data
    if (isAllowedToDeleteData(req.user.role)) {
      const filteredData = consolidateData.filter(item => item.id !== id);
      if (filteredData.length < consolidateData.length) {
        writeConsolidateDataToFile(filteredData);
        res.json({ message: 'Data deleted successfully' });
      } else {
        res.status(404).json({ error: 'Data not found' });
      }
    } else {
      res.status(403).json({ error: 'Permission denied' });
    }
  });

// Start the server
function startServer() {
  app.listen(port, function (err) {
    if (err) {
      console.log('Error while starting server');
    } else {
      console.log('Server has been started at ' + port);
    }
  });

  main();
}

// Export necessary functions and variables
module.exports = { startServer };
