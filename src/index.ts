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
  await fs.promises.writeFile(
    './1_kml-FastXmlParserObject.json',
    JSON.stringify(kmlAsXml, null, 2),
    'utf8'
  );

  const kmlNode = kmlAsXml.find((node: any) => node?.kml)?.kml;
  const kml = parseKmlNode(kmlNode);
  await fs.promises.writeFile(
    './2_kmlAsJsonObject.json',
    JSON.stringify(kml, null, 2),
    'utf8'
  );

  // Build a KML file from the parsed data
  const kmlAsXmlBuilt = buildKmlAsXmlObject(kml);
  await fs.promises.writeFile(
    './3_kmlAsJsonObject-FastXmlParserObject.json',
    JSON.stringify(kmlAsXmlBuilt, null, 2),
    'utf8'
  );

  const xmlContent = buildKmlString(kmlAsXmlBuilt);

  // Save the KML file
  await writeKmlKmz(xmlContent, './4_output.kml');
  console.log('KML file saved successfully!');
};

main();
