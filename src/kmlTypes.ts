export class KmlFeature {
  name?: string;
  description?: string;
  features?: KmlFeature[];
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
