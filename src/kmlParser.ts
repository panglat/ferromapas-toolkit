import { parse } from 'path';
import {
  Kml,
  KmlDocument,
  KmlFeature,
  KmlFolder,
  KmlLineString,
  KmlPlacemark,
  KmlPoint,
} from './kmlTypes';

function parseTextValue(
  value: Array<{ [key: string]: any }>
): string | undefined {
  return value?.[0]?.['#text'] as string | undefined;
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
      if (key === 'Placemark') {
        acc.features = acc.features || [];
        acc.features.push(parseKmlPlacemarkNode(value));
      }
    });

    return acc;
  }, feature);
  return parsedFeature;
}

function parseKmlPoint(node: any): KmlPoint | undefined {
  return node.reduce((acc: KmlPoint, n: any) => {
    Object.entries(n).forEach(([key, value]) => {
      switch (key) {
        case 'coordinates':
          const coordinates = parseTextValue(value as [{ [key: string]: any }]);
          acc.coordinates = coordinates;
      }
    });
    return acc;
  }, {} as KmlPoint);
}

function parseKmlLineString(node: any): KmlLineString {
  return node.reduce((acc: KmlLineString, n: any) => {
    Object.entries(n).forEach(([key, value]) => {
      switch (key) {
        case 'coordinates':
          const coordinates = parseTextValue(value as [{ [key: string]: any }]);
          acc.coordinates = coordinates;
      }
    });
    return acc;
  }, {} as KmlLineString);
}

export function parseKmlPlacemarkNode(node: any): KmlPlacemark {
  const placemark: KmlPlacemark = parseKmlFeatureNode(node, new KmlPlacemark());
  node.forEach((n: any) => {
    Object.entries(n).forEach(([key, value]) => {
      switch (key) {
        case 'Point':
          placemark.Point = parseKmlPoint(value);
          break;
        case 'LineString':
          placemark.LineString = parseKmlLineString(value);
          break;
      }
    });
  });
  return placemark;
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
