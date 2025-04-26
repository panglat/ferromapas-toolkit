import * as fs from 'fs';
import * as path from 'path';
import AdmZip from 'adm-zip';
import { XMLParser } from 'fast-xml-parser';
import {
  Feature,
  Kml,
  KmlDocument,
  KmlFolder,
  KmlPlacemark,
} from './types/types';

async function readKmlString(
  filePath: string
): Promise<{ kmlString: string; isKmz: boolean }> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.kmz') {
    // Process KMZ file: open the ZIP archive and find the KML file (commonly "doc.kml")
    const zip = new AdmZip(filePath);
    const kmlEntry = zip
      .getEntries()
      .find((entry) => path.extname(entry.entryName).toLowerCase() === '.kml');
    if (!kmlEntry) {
      throw new Error('No KML file found inside the KMZ archive.');
    }
    return { kmlString: kmlEntry.getData().toString('utf-8'), isKmz: true };
  } else if (ext === '.kml') {
    // Read the KML file directly
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return { kmlString: data, isKmz: false };
  } else {
    throw new Error(
      'Unsupported file type. Only .kml and .kmz files are supported.'
    );
  }
}

////// TODO: Parsear por Features!!!

function parseDocument(rawFeature: any): KmlDocument {
  const document: KmlDocument = {
    name: rawFeature.name,
    description: rawFeature.description,
    features: Object.entries(rawFeature)
      .filter(
        ([key]) => key === 'Placemark' || key === 'Folder' || key === 'Document'
      )
      .map(([key, value]) => parseFeature(key, value))
      .filter((feature) => feature !== undefined),
  };

  /*
  if (rawDoc.Style) {
    document.Style = ensureArray(rawDoc.Style).map(parseStyle);
  }
  if (rawDoc.Folder) {
    document.Folder = ensureArray(rawDoc.Folder).map(parseFolder);
  }
  if (rawDoc.Placemark) {
    document.Placemark = ensureArray(rawDoc.Placemark).map(parsePlacemark);
  }
*/
  return document;
}

function parseFolder(rawFeature: any) {
  const folder: KmlFolder = {
    name: rawFeature.name,
    description: rawFeature.description,
    features: Object.entries(rawFeature)
      .filter(
        ([key]) => key === 'Placemark' || key === 'Folder' || key === 'Document'
      )
      .map(([key, value]) => parseFeature(key, value))
      .filter((feature) => feature !== undefined),
  };
  return folder;
}

function parsePlacemark(rawFeature: any) {
  const placemark: KmlPlacemark = {
    name: rawFeature.name,
    description: rawFeature?.description,
    styleUrl: rawFeature?.styleUrl,
    Point: rawFeature?.Point,
    LineString: rawFeature?.LineString,
    Polygon: rawFeature?.Polygon,
    MultiGeometry: rawFeature?.MultiGeometry,
  };
  return placemark;
}

function parseFeature(key: string, value: any): any {
  if (Array.isArray(value)) {
    return value.map((v) => parseFeature(key, v));
  } else {
    switch (key) {
      case 'Document':
        return parseDocument(value);
      case 'Folder':
        return parseFolder(value);
      case 'Placemark':
        return parsePlacemark(value);
    }
  }
}

async function parseKml(kmlAsString: string) {
  // Parse the XML content into a JavaScript object
  const parser = new XMLParser({
    preserveOrder: true, // Mantiene el orden de los nodos
    ignoreAttributes: false, // Conserva los atributos si los hay
    alwaysCreateTextNode: true, // Garantiza que cada nodo tenga un valor
  });
  const parsedKml = parser.parse(kmlAsString);

  // The root of the KML document is expected to be <kml> with a <Document> child.
  const kml: Kml = parsedKml;
  if (!kml.kml || !kml.kml.Document) {
    throw new Error('Invalid KML structure: <Document> element is missing.');
  }

  // Parse the Document (which includes Styles, Folders, Placemarks, etc.)
  const documentParsed: KmlDocument = parseDocument(kml.kml.Document);

  return documentParsed;
}

export async function openKmzKml(filePath: string) {
  const { kmlString, isKmz } = await readKmlString(filePath);
  const parsedKml = await parseKml(kmlString);

  return parsedKml;
}
