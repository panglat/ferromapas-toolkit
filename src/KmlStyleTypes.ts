// types/kmlStyles.ts

// Defines the structure for the IconStyle element inside a Style
export type IconStyle = {
  scale?: number; // Scale factor for the icon
  heading?: number; // Rotation of the icon in degrees
  Icon?: {
    href: string; // URL reference to the icon image
  };
};

// Defines the structure for the LabelStyle element inside a Style
export type LabelStyle = {
  color?: string; // Color of the label text (in aabbggrr format)
  scale?: number; // Scale factor for the label text
};

// Defines the structure for the LineStyle element inside a Style
export type LineStyle = {
  color?: string; // Color of the line (in aabbggrr format)
  width?: number; // Width of the line in pixels
};

// Defines the structure for the PolyStyle element inside a Style
export type PolyStyle = {
  color?: string; // Color of the polygon fill (in aabbggrr format)
  fill?: boolean; // Whether to fill the polygon (true/false)
  outline?: boolean; // Whether to outline the polygon (true/false)
};

// Represents a full KML Style element, which can include multiple style types
export type KmlStyle = {
  id?: string; // Optional identifier for the Style
  IconStyle?: IconStyle;
  LabelStyle?: LabelStyle;
  LineStyle?: LineStyle;
  PolyStyle?: PolyStyle;
};

// Represents a Pair element inside a StyleMap, linking a key to a styleUrl
export type KmlStyleMapPair = {
  key: 'normal' | 'highlight'; // Key defining when the style is used
  styleUrl: string; // URL reference to the Style
};

// Represents a KML StyleMap element, which is a collection of Pairs
export type KmlStyleMap = {
  id?: string; // Optional identifier for the StyleMap
  pairs: KmlStyleMapPair[]; // List of key-styleUrl pairs
};
