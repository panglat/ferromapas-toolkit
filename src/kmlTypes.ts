export class KmlFeature {
  name?: string;
  description?: string;
  features?: KmlFeature[];
}

export interface KmlPoint {
  coordinates?: string;
}

export interface KmlLineString {
  coordinates?: string;
}

export class KmlPlacemark extends KmlFeature {
  styleUrl?: string; // Reference to a style (e.g., "#myStyle")
  Point?: KmlPoint;
  LineString?: KmlLineString;
  //  Polygon?: KmlPolygon;
  //  MultiGeometry?: KmlMultiGeometry;
}

export class KmlFolder extends KmlFeature {}

export class KmlDocument extends KmlFeature {
  /**
   * Styles can be a single Style or an array of Styles.
   */
  //style?: KmlStyle | KmlStyle[];
  /**
   * Placemarks contained directly within the Document.
   */
}

export class Kml {
  kml?: {
    Document: KmlDocument;
  };
}
