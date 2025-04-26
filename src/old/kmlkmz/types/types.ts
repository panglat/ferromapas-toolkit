export interface KmlDocument {
  name?: string;
  description?: string;
  /**
   * Styles can be a single Style or an array of Styles.
   */
  //style?: KmlStyle | KmlStyle[];
  /**
   * Placemarks contained directly within the Document.
   */
  features?: Feature[];
}

export interface KmlFolder {
  name: string;
  description?: string;
  features?: Feature[];
}

export interface Kml {
  kml: {
    Document: KmlDocument;
  };
}

export interface KmlPoint {
  coordinates: string;
}

export interface KmlLineString {
  coordinates: string;
}

export interface KmlLinearRing {
  coordinates: string;
}

export interface KmlPolygon {
  outerBoundaryIs: {
    LinearRing: KmlLinearRing;
  };
  innerBoundaryIs?:
    | {
        LinearRing: KmlLinearRing;
      }
    | Array<{ LinearRing: KmlLinearRing }>;
}

export interface KmlMultiGeometry {
  Point?: KmlPoint | KmlPoint[];
  LineString?: KmlLineString | KmlLineString[];
  Polygon?: KmlPolygon | KmlPolygon[];
}

export interface KmlPlacemark {
  name: string;
  description?: string;
  styleUrl?: string; // Reference to a style (e.g., "#myStyle")
  Point?: KmlPoint;
  LineString?: KmlLineString;
  Polygon?: KmlPolygon;
  MultiGeometry?: KmlMultiGeometry;
}

export type Feature = KmlDocument | KmlFolder | KmlPlacemark;
