const request = require('request');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

var options = { json: true };
const consolidateDataFilePath = path.join(__dirname, 'consolidateData.json');

async function mergePartnersData(partnerDataArr) {
    const consolidateData = [];
  
    for (const url of partnerDataArr) {
      try {
        const body = await requestData(url);
        // Add a unique id to each item
        const dataWithId = body.map(item => ({ id: uuidv4(), ...item }));
        consolidateData.push(...dataWithId);
      } catch (error) {
        console.log(error);
      }
    }
  
    // Write consolidateData to JSON file
    try {
      const jsonData = JSON.stringify(consolidateData, null, 2);
      fs.writeFileSync(consolidateDataFilePath, jsonData);
      //console.log('consolidateData written to file:', consolidateDataFilePath);
    } catch (error) {
      console.error('Error writing consolidateData to file:', error);
    }
  
    return consolidateData;
  }
  
  function requestData(url) {
    return new Promise((resolve, reject) => {
      request(url, options, (error, res, body) => {
        if (error) {
          reject(error);
        } else if (res.statusCode == 200) {
          resolve(body);
        } else {
          reject(`Request failed with status code ${res.statusCode}`);
        }
      });
    });
  }
  
  // Use this function to read consolidateData from the file globally
  function readConsolidateDataFromFile() {
    try {
      const rawData = fs.readFileSync(consolidateDataFilePath);
      return JSON.parse(rawData);
    } catch (error) {
      console.error('Error reading consolidateData from file:', error);
      return [];
    }
  }
  
  // Write consolidateData to the file
  function writeConsolidateDataToFile(consolidateData) {
    try {
      const jsonData = JSON.stringify(consolidateData, null, 2);
      fs.writeFileSync(consolidateDataFilePath, jsonData);
      //console.log('consolidateData written to file:', consolidateDataFilePath);
    } catch (error) {
      console.error('Error writing consolidateData to file:', error);
    }
  }

// Helper functions to check user roles
function isAllowedToAddData(userRole) {
    return userRole === 'Admin' || userRole === 'Editor';
  }
  
  function isAllowedToDeleteData(userRole) {
    return userRole === 'Admin';
  }
  
  function isAllowedToEditData(userRole) {
    return userRole === 'Admin' || userRole === 'Editor';
  }

// Export necessary functions
module.exports = {
  mergePartnersData,
  readConsolidateDataFromFile,
  writeConsolidateDataToFile,
  isAllowedToAddData,
  isAllowedToDeleteData,
  isAllowedToEditData,
};
