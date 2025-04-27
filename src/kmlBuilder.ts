import { Kml, KmlDocument, KmlFolder } from './kmlTypes';

export function buildXmlHeader() {
  const xmlObject = {
    '?xml': [
      {
        '#text': '',
      },
    ],
    ':@': {
      '@_version': '1.0',
      '@_encoding': 'UTF-8',
    },
  };
  return xmlObject;
}

export function buildKmlText(nodeName: string, text: string) {
  return { [nodeName]: [{ '#text': text }] };
}

export function buildKmlFolderNode(folder?: KmlFolder) {
  const xmlObject = {
    Folder: [
      folder?.name ? buildKmlText('name', folder.name) : null,
      folder?.description
        ? buildKmlText('description', folder.description)
        : null,
    ].filter((node) => node !== null), // Filter out null values
  };

  return xmlObject;
}

export function buildKmlDocumentNode(document?: KmlDocument): any {
  const xmlObject = {
    Document: [
      document?.name ? buildKmlText('name', document.name) : null,
      document?.description
        ? buildKmlText('description', document.description)
        : null,
      document?.features
        ?.map((feature) => {
          if (feature instanceof KmlFolder) {
            return buildKmlFolderNode(feature);
          }
          return null; // Explicitly return null for non-KmlFolder features
        })
        .filter((node) => node !== null), // Filter out null values
    ]
      .filter((node) => node !== null) // Filter out null values
      .flat(), // Flatten the array to remove nested arrays
  };

  return xmlObject;
}

export function buildKmlNode(kml: Kml): any {
  const xmlObject = {
    kml: [buildKmlDocumentNode(kml?.kml?.Document)],
    ':@': {
      '@_xmlns': 'http://www.opengis.net/kml/2.2',
      '@_xmlns:gx': 'http://www.google.com/kml/ext/2.2',
      '@_xmlns:kml': 'http://www.opengis.net/kml/2.2',
      '@_xmlns:atom': 'http://www.w3.org/2005/Atom',
    },
  };
  return xmlObject;
}

export function buildKmlAsXmlObject(kml: any) {
  return [buildXmlHeader(), buildKmlNode(kml)];
}
