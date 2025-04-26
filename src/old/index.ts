import { openKmzKml } from './kmlkmz';

const main = async () => {
  /*
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: node kmlParser.js <path-to-kml-or-kmz-file>");
    process.exit(1);
  }
*/

  // Read a KML or KMZ file
  const filePath = './ferromapas.kmz';
  const ret = await openKmzKml(filePath);
  console.log(ret);
  /*
  // Parse the KML string
  const kml = parseKmlString(kmlString);

  // Extract placemarks from the KML object
  const placemarks = extractPlacemarks(kml);

  // Print the extracted placemarks
  console.log(placemarks);
  */
};

main();
