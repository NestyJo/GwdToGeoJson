const express = require('express');
const fs = require('fs');
const path = require('path');

const { convertDWGToGeoJSONWithCRS } = require('./converter');

const app = express();
app.use(express.json());


app.post('/convert-dwg', (req, res) => {
    const { inputDWGPath } = req.body; 
    
    if (!inputDWGPath) {
      return res.status(400).json({ error: 'inputDWGPath is required' });
    }
  
    const inputDWG = path.resolve(inputDWGPath);
    
    const outputDirectory = path.resolve('output');
    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory);
    }
  
    const outputGeojson = path.join(outputDirectory, 'output.geojson');
  
    try {
      convertDWGToGeoJSONWithCRS(inputDWG, outputGeojson);
      res.status(200).json({ message: 'Conversion complete', outputGeojson });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to convert DWG to GeoJSON' });
    }
});


app.listen(3000, () => {
  console.log('Am live through http://localhost:3000');
});
