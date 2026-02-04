import type { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class FZapApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: "file:fzap.svg";
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
    test: ICredentialTestRequest;
}
