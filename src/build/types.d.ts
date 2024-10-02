export interface WidthMap {
  [key: string]: string
  [key: number]: string
}
export interface HeroImage {
  parent: string
  widths: {
    [key: number]: string
  }
  srcset: string
}

export interface HeroImageBase {
  parent: string
  widths: {
    [key: number]: string
  }
}
export interface esbuildOutputs {
  [k: string]:
  {
    bytes: number
    inputs: string[] | []
    exports: string[] | []
    entryPoint?: string
  }
}
export interface FileHashes {
  palette: string;
  main: string;
}
export interface MetaFileOutputs {
  bytes: number;
  inputs: { [path: string]: { bytesInOutput: number } };
  exports: string[];
  entryPoint?: string;
}

export interface buildJson {
  noScriptImage: string;
  SCRIPTBUNDLE: string;
  CSSBUNDLE: string;
}

export interface Project {
  entryPoints: string[];
  entryNames?: string;
  outdir?: string;
  tsconfig: string;
  platform?: "node" | "browser";
}
