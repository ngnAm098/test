import { Dzongkhag } from './dzongkhag';

export interface PoliceStation {
  id: number;
  dzongkhag: Dzongkhag;
  policeStationName: string;
}
