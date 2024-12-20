export declare function walk<T extends object>(
  treeArr: T[],
  childProperty: string,
  callback: WalkTreeCallback<T>
): Promise<void>;

export declare function flatten<T extends PointerNodes>(
  treeArr1: T[],
  id?: string,
  pid?: string,
  childProperty?: string
): Promise<T[]>;
export declare function tree<T extends PointerNodes>(
  flatArr1: T[],
  id?: string,
  pid?: string,
  childProperty?: string
): T[];
