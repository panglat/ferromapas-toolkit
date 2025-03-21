/**
 * Interface for Styles
 * In KML, styles are used to customize the appearance of elements such as icons, labels,
 * lines, and polygons. This is a simplified definition that can be extended as needed.
 */
export interface KmlStyle {
  id?: string;
  IconStyle?: KmlIconStyle;
  LabelStyle?: KmlLabelStyle;
  LineStyle?: KmlLineStyle;
  PolyStyle?: KmlPolyStyle;
}

/**
 * Icon Style interface.
 */
export interface KmlIconStyle {
  color?: string; // Color in hexadecimal format (e.g., "ff0000ff")
  scale?: number; // Scale of the icon
  icon?: KmlIcon; // Definition of the icon to use
}

/**
 * Icon definition interface.
 */
export interface KmlIcon {
  href: string; // URL or path to the icon graphic resource
}

/**
 * Label Style interface.
 */
export interface KmlLabelStyle {
  color?: string; // Color of the label
  scale?: number; // Scale of the label
}

/**
 * Line Style interface.
 */
export interface KmlLineStyle {
  color?: string; // Color of the line
  width?: number; // Width of the line
}

/**
 * Polygon Style interface.
 */
export interface KmlPolyStyle {
  color?: string; // Color of the polygon
  fill?: number; // Value (usually 0 or 1) indicating if it is filled
  outline?: number; // Value (usually 0 or 1) indicating if the outline is shown
}

/**
 * Interface for LineString
 * Represents a sequence of coordinates (latitude, longitude, and optionally altitude)
 * that define a line.
 */
export interface KmlLineString {
  coordinates: string;
  // A string containing coordinates separated by spaces or newlines.
  // Example: "102.0,0.5,0 103.0,1.0,0"
}

/**
 * Interface for Placemark
 * Represents a point of interest on the map. A Placemark can contain different types of geometry.
 * In this example, a LineString is shown as an example.
 */
export interface KmlPlacemark {
  name: string;
  description?: string;
  styleUrl?: string; // Reference to the id of a KmlStyle (prefixed with "#" in KML)
  lineString?: KmlLineString; // If the Placemark represents a line
  // Other geometries such as Point, Polygon, etc., can be added here.
}

/**
 * Interface for Folder
 * A Folder is a grouping that can contain other folders and/or placemarks.
 */
export interface KmlFolder {
  name: string;
  description?: string;
  folders?: KmlFolder[]; // Sub-folders, if there is a hierarchical structure
  placemarks?: KmlPlacemark[]; // Placemarks contained within the folder
}
