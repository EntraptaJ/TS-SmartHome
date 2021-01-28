// src/Modules/Power/DayUsageResponse.ts
interface SetXML {
  '@_value': string;
}

interface DatasetXML {
  '@_seriesName': string;
  '@_color': string;
  '@_showValues': string;

  set: SetXML[];
}

interface StyleDefinition {
  style: {
    '@_type': string;
    '@_name': string;
    '@_size': string;
    '@_color': string;
  };
}

interface ApplicationStyle {
  apply: { '@_toObject': string; '@_styles': string };
}

interface Styles {
  definition: StyleDefinition;

  application: ApplicationStyle;
}

interface Category {
  '@_label': string;
}

interface Categories {
  category: Category[];
}

interface Charts {
  '@_palette': string;

  '@_caption': string;

  '@_numberSuffix': string;

  styles: Styles;

  categories: Categories;

  dataset: DatasetXML[];
}

export interface DayUsageParsedXML {
  chart: Charts;
}
