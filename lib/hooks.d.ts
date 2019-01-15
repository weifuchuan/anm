import { Effect } from './types';
export declare function getId(): number;
export declare function beginRender(id: number): void;
export declare function endRender(id: number): void;
export declare function useState<S = any>(initState: S): [S, (s: S) => void];
export declare function useEffect(effect: Effect, inputs?: any[]): void;
