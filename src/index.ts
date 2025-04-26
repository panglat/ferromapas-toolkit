import { parse } from 'path';
import { readKmlString } from './kmlkmzFileHandler';
import { parseKmlString } from './kmlParserBuilder';
import { parseKmlNode } from './kmlParser';

const main = async () => {
  // Read a KML or KMZ file
  const filePath = './ferromapas.kmz';
  const { kmlString, isKmz } = await readKmlString(filePath);
  const kmlAsXml = parseKmlString(kmlString);
  const kmlNode = kmlAsXml.find((node: any) => node?.kml)?.kml;
  const kml = parseKmlNode(kmlNode);
  console.log(kmlAsXml);
  console.log(kml);
};

main();
