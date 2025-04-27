import { parse } from 'path';
import {
  Kml,
  KmlDocument,
  KmlFeature,
  KmlFolder,
  KmlLinearRing,
  KmlLineString,
  KmlOuterBoundaryIs,
  KmlPlacemark,
  KmlPoint,
  KmlPolygon,
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
      switch (key) {
        case 'Document': {
          acc.features = acc.features || [];
          acc.features.push(parseDocumentNode(value));
          break;
        }
        case 'Folder': {
          acc.features = acc.features || [];
          acc.features.push(parseKmlFolderNode(value));
          break;
        }
        case 'Placemark': {
          acc.features = acc.features || [];
          acc.features.push(parseKmlPlacemarkNode(value));
          break;
        }
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

function parseKmlLinearRing(node: any): KmlLinearRing {
  return node.reduce((acc: KmlLinearRing, n: any) => {
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

function parseKmlOuterBoundaryIsString(node: any): KmlOuterBoundaryIs {
  return node.reduce((acc: KmlOuterBoundaryIs, n: any) => {
    Object.entries(n).forEach(([key, value]) => {
      switch (key) {
        case 'LinearRing':
          const linearRing = parseKmlLinearRing(value);
          acc.LinearRing = linearRing;
          break;
      }
    });
    return acc;
  }, {} as KmlOuterBoundaryIs);
}

function parseKmlPolygonString(node: any): KmlPolygon {
  return node.reduce((acc: KmlPolygon, n: any) => {
    Object.entries(n).forEach(([key, value]) => {
      switch (key) {
        case 'outerBoundaryIs':
          const outerBoundaryIs = parseKmlOuterBoundaryIsString(
            value as [{ [key: string]: any }]
          );
          acc.outerBoundaryIs = outerBoundaryIs;
      }
    });
    return acc;
  }, {} as KmlPolygon);
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
        case 'Polygon':
          placemark.Polygon = parseKmlPolygonString(value);
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
