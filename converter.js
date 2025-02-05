const gdal = require('gdal-async');

function convertDWGToGeoJSONWithCRS(inputDWG, outputGeojson) {
    const dataset = gdal.open(inputDWG);
    const targetSRS = gdal.SpatialReference.fromEPSG(32737);
  
    const driver = gdal.drivers.get('GeoJSON');
  
    if (!driver) {
      throw new Error('GeoJSON driver is not available');
    }
  
    const outputDataset = driver.create(outputGeojson, dataset.rasterSize.x, dataset.rasterSize.y, 0, gdal.GDT_Unknown, []);
  
    outputDataset.srs = targetSRS;
  
    const transform = dataset.srs ? dataset.srs.getTransformTo(targetSRS) : null;
    
    dataset.layers.get(0).features.forEach((feature) => {
      if (transform) {
        feature.geometry.transform(transform);
      }
      outputDataset.layers.get(0).features.add(feature);
    });
  
    console.log(`Conversion complete: ${outputGeojson}`);
}

module.exports = { convertDWGToGeoJSONWithCRS };