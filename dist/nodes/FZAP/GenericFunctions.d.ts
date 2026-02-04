import type { IExecuteFunctions, IHttpRequestMethods, IDataObject, ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
export declare function getFzapInstanceOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
export declare function fzapApiRequest(this: IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject | number, query?: IDataObject | number, itemIndex?: number): Promise<IDataObject | IDataObject[]>;
export declare function fzapAdminApiRequest(this: IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, query?: IDataObject): Promise<IDataObject | IDataObject[]>;
