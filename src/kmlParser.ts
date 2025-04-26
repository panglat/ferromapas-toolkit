import { parse } from 'path';
import { Kml, KmlDocument, KmlFeature, KmlFolder } from './kmlTypes';

function parseTextValue(value: Array<{ [key: string]: any }>): string {
  return value?.[0]['#text'] as string;
}

export function parseKmlFeature(
  key: string,
  value: [{ [key: string]: any }],
  feature: KmlFeature
): KmlDocument {
  switch (key) {
    case 'name':
      feature.name = parseTextValue(value);
      break;
    case 'description':
      feature.description = parseTextValue(value);
      break;
  }
  return feature;
}

export function parseKmlFeatureNode<T extends KmlFeature>(
  node: any,
  feature: T
): T {
  const parsedFeature: T = node.reduce((acc: T, n: any) => {
    Object.entries(n).forEach(([key, value]) => {
      parseKmlFeature(key, value as [{ [key: string]: any }], acc);
      if (key === 'Document') {
        acc.features = acc.features || [];
        acc.features.push(parseDocumentNode(value));
      }
      if (key === 'Folder') {
        acc.features = acc.features || [];
        acc.features.push(parseKmlFolderNode(value));
      }
    });

    return acc;
  }, feature);
  return parsedFeature;
}

export function parseKmlFolderNode(node: any): KmlFolder {
  const folder: KmlFolder = parseKmlFeatureNode(node, new KmlFolder());
  return folder;
}

export function parseDocumentNode(node: any): KmlFolder {
  const document: KmlDocument = parseKmlFeatureNode(node, new KmlDocument());
  return document;
}

export function parseKmlNode(nodes: any) {
  const kml: Kml = {
    kml: {
      Document: parseDocumentNode(nodes[0]?.Document),
    },
  };
  return kml;
}
