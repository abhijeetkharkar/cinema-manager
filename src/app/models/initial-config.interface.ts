export interface InitialConfig {
  status: boolean;
  lookupPaths: LookupPath[] | undefined;
}

export interface LookupPath {
  id: number;
  path: string;
}
