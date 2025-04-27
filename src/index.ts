import { readKmlString, writeKmlKmz } from './kmlkmzFileHandler';
import { buildKmlString, parseKmlString } from './kmlParserBuilder';
import { parseKmlNode } from './kmlParser';
import { buildKmlAsXmlObject, buildKmlNode } from './kmlBuilder';

import fs from 'fs';

const main = async () => {
  // Read a KML or KMZ file
  const filePath = './ferromapas.kmz';
  const { kmlString, isKmz } = await readKmlString(filePath);
  const kmlAsXml = parseKmlString(kmlString);
  const kmlNode = kmlAsXml.find((node: any) => node?.kml)?.kml;
  const kml = parseKmlNode(kmlNode);
  console.log(kmlAsXml);
  console.log(kml);

  // Build a KML file from the parsed data
  const kmlAsXmlBuilt = buildKmlAsXmlObject(kml);

  await fs.promises.writeFile(
    './output1.json',
    JSON.stringify(kmlAsXml, null, 2),
    'utf8'
  );
  const xmlContent = buildKmlString(kmlAsXmlBuilt);
  await fs.promises.writeFile(
    './output.json',
    JSON.stringify(xmlContent, null, 2),
    'utf8'
  );
  // Save the KML file
  await writeKmlKmz(xmlContent, './output.kml');
};

main();
