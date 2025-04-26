import { XMLBuilder, XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false });
const builder = new XMLBuilder({
  preserveOrder: true,
  ignoreAttributes: false,
  format: true,
});

export function parseKmlString(kmlString: string) {
  const kmlAsXML = parser.parse(kmlString);
  return kmlAsXML;
}

export function buildKmlString(kmlObject: any) {
  const kmlAsXML = builder.build(kmlObject);
  return kmlAsXML;
}
