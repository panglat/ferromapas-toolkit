import {
  Kml,
  KmlDocument,
  KmlFeature,
  KmlFolder,
  KmlPlacemark,
} from './kmlTypes';

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

export function buildKmlFeatureNode(feature: KmlFeature) {
  const xmlObject = [
    feature?.name ? buildKmlText('name', feature.name) : null,
    feature?.description
      ? buildKmlText('description', feature.description)
      : null,
    Array.isArray(feature?.features)
      ? feature?.features
          ?.map((feature) => buildKmlFeature(feature))
          .filter((node) => node !== null) // Filter out null values
      : null,
  ]
    .filter((node) => node !== null) // Filter out null values
    .flat(); // Flatten the array to remove nested arrays
  return xmlObject;
}

export function buildKmlPlacemarkNode(placemark: KmlPlacemark) {
  const xmlObject = {
    Placemark: [
      ...buildKmlFeatureNode(placemark),
      placemark?.Point
        ? {
            Point: [
              buildKmlText('coordinates', placemark?.Point?.coordinates || ''),
            ],
          }
        : null,
      placemark?.LineString
        ? {
            LineString: [
              buildKmlText(
                'coordinates',
                placemark?.LineString?.coordinates || ''
              ),
            ],
          }
        : null,
    ].filter((node) => node !== null), // Filter out null values
  };
  return xmlObject;
}

export function buildKmlFolderNode(folder: KmlFolder) {
  const xmlObject = {
    Folder: buildKmlFeatureNode(folder),
  };
  return xmlObject;
}

export function buildKmlDocumentNode(document: KmlDocument): any {
  const xmlObject = {
    Document: buildKmlFeatureNode(document),
  };

  return xmlObject;
}

export function buildKmlFeature(feature: KmlFeature): any {
  if (feature instanceof KmlPlacemark) {
    return buildKmlPlacemarkNode(feature);
  } else if (feature instanceof KmlFolder) {
    return buildKmlFolderNode(feature);
  } else if (feature instanceof KmlDocument) {
    return buildKmlDocumentNode(feature);
  }
  return null; // Explicitly return null for non-KmlFolder features
}

export function buildKmlNode(kml: Kml): any {
  const xmlObject = {
    kml: [buildKmlFeature(kml?.kml?.Document || {})],
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
