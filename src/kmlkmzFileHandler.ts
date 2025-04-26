import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';

export async function readKmlString(
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

export async function writeKmlKmz(kmlContent: string, filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  const fileName = path.basename(filePath, ext).toLowerCase();
  if (ext === '.kmz') {
    const zip = new AdmZip();
    zip.addFile(`${fileName}.kml`, Buffer.from(kmlContent, 'utf8'));
    zip.writeZip(fileName);
  } else {
    // If the file is not a KMZ, just write the KML content to a file
    await fs.promises.writeFile(filePath, kmlContent, 'utf8');
  }
}
