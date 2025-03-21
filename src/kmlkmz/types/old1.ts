/**
 * KMZ/KML TypeScript Definitions
 *
 * This file contains interfaces representing the common elements
 * found in a KMZ file. A KMZ file is essentially a zipped KML file with
 * additional resources (like images, icons, etc.).
 *
 * The following objects are defined:
 * - Styles (and their subtypes: IconStyle, LabelStyle, LineStyle, PolyStyle)
 * - Folders
 * - LineString
 * - Placemark
 * - Other geometries (Point, Polygon, etc.) and container objects
 */

/* =================== Geometry Interfaces =================== */

/**
 * Represents a KML Point geometry.
 * Coordinates should be in the format: "longitude,latitude[,altitude]".
 */
export interface KmlPoint {
  coordinates: string;
}

/**
 * Represents a KML LineString geometry.
 * Coordinates should be provided as a string with multiple coordinate tuples,
 * separated by spaces or newlines.
 *
 * Example: "102.0,0.5,0 103.0,1.0,0"
 */
export interface KmlLineString {
  coordinates: string;
}

/**
 * Represents a LinearRing, which is used to define boundaries in polygons.
 */
export interface KmlLinearRing {
  coordinates: string;
}

/**
 * Represents a KML Polygon geometry.
 * A polygon has an outer boundary and, optionally, inner boundaries (holes).
 */
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

/**
 * Represents a MultiGeometry element, which can contain multiple geometry types.
 */
export interface KmlMultiGeometry {
  Point?: KmlPoint | KmlPoint[];
  LineString?: KmlLineString | KmlLineString[];
  Polygon?: KmlPolygon | KmlPolygon[];
}

/* =================== Style Interfaces =================== */

/**
 * Represents a KML Style element used to customize the appearance of features.
 */
export interface KmlStyle {
  id?: string;
  IconStyle?: KmlIconStyle;
  LabelStyle?: KmlLabelStyle;
  LineStyle?: KmlLineStyle;
  PolyStyle?: KmlPolyStyle;
}

/**
 * Represents an IconStyle element.
 */
export interface KmlIconStyle {
  color?: string; // Hexadecimal color (e.g., "ff0000ff")
  scale?: number; // Scale factor for the icon
  icon?: KmlIcon; // Icon definition
}

/**
 * Represents an Icon element used within IconStyle.
 */
export interface KmlIcon {
  href: string; // URL or file path to the icon image
}

/**
 * Represents a LabelStyle element.
 */
export interface KmlLabelStyle {
  color?: string; // Color of the label
  scale?: number; // Scale factor for the label
}

/**
 * Represents a LineStyle element.
 */
export interface KmlLineStyle {
  color?: string; // Color of the line
  width?: number; // Width of the line
}

/**
 * Represents a PolyStyle element used for polygons.
 */
export interface KmlPolyStyle {
  color?: string; // Fill color for the polygon
  fill?: number; // Indicates whether the polygon is filled (0 or 1)
  outline?: number; // Indicates whether the polygon outline is drawn (0 or 1)
}

/* =================== Feature Interfaces =================== */

/**
 * Represents a Placemark element.
 * A Placemark is a feature on the map that may contain various geometry types.
 * It can reference a style and include geometries like Point, LineString, Polygon, or MultiGeometry.
 */
export interface KmlPlacemark {
  name: string;
  description?: string;
  styleUrl?: string; // Reference to a style (e.g., "#myStyle")
  Point?: KmlPoint;
  LineString?: KmlLineString;
  Polygon?: KmlPolygon;
  MultiGeometry?: KmlMultiGeometry;
}

/**
 * Represents a Folder element.
 * A Folder is used to group multiple features (Placemarks) and/or nested Folders.
 */
export interface KmlFolder {
  name: string;
  description?: string;
  /**
   * Nested Folders. Can be a single folder or an array of folders.
   */
  Folder?: KmlFolder | KmlFolder[];
  /**
   * Placemarks contained within the folder.
   * Can be a single Placemark or an array of Placemarks.
   */
  Placemark?: KmlPlacemark | KmlPlacemark[];
  // Other elements (e.g., GroundOverlay, ScreenOverlay) can be added here if needed.
}

/* =================== Container Interfaces =================== */

/**
 * Represents the Document element in a KML file.
 * The Document is the main container for styles and features.
 */
export interface KmlDocument {
  name?: string;
  description?: string;
  /**
   * Styles can be a single Style or an array of Styles.
   */
  style?: KmlStyle | KmlStyle[];
  /**
   * Placemarks contained directly within the Document.
   */
  features?: any[];
  // Other elements like NetworkLink can be added as needed.
}

/**
 * Represents the root KML element.
 */
export interface Kml {
  kml: {
    Document: KmlDocument;
  };
}

/* =================== Optional KMZ Archive Interface =================== */

/**
 * Represents a KMZ archive.
 * A KMZ file is a ZIP file containing a KML file and additional resources.
 */
export interface KmzArchive {
  /**
   * The main KML content extracted from the KMZ file.
   */
  kml: Kml;
  /**
   * A collection of additional files included in the KMZ.
   * The key is the file path within the archive, and the value is the file data as a Buffer.
   */
  files?: { [filePath: string]: Buffer };
}
