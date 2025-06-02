export interface CME {
  cmeID: string;
  startTime: string;
  sourceLocation?: string;
  activeRegionNum?: number;
  cmeAnalyses?: CMEAnalysis[];
  note?: string;
}

export interface CMEAnalysis {
  time21_5?: string;
  speed?: number;
  halfAngle?: number;
  kp_index?: number;
  isMostAccurate: boolean;
}

export interface GST {
  gstID: string;
  startTime: string;
  allKpIndex?: KpIndex[];
  source?: string;
  link?: string;
}

export interface KpIndex {
  kpIndex: string;
}

export interface FLR {
  flrID: string;
  classType: string;
  beginTime: string;
  peakTime: string;
  endTime: string;
  sourceLocation?: string;
  activeRegionNum?: number;
  instruments?: Instrument[];
  note?: string;
}

export interface Instrument {
  displayName: string;
}