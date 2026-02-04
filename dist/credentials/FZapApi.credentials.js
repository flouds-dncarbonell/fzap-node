"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FZapApi = void 0;
class FZapApi {
    constructor() {
        this.name = 'fZapApi';
        this.displayName = 'FZAP API';
        this.documentationUrl = 'https://flouds.com.br/openapi/fzap-openapi.en.yaml';
        this.icon = 'file:fzap.svg';
        this.properties = [
            {
                displayName: 'Authentication',
                name: 'authType',
                type: 'options',
                options: [
                    {
                        name: 'Instance Token',
                        value: 'instanceToken',
                    },
                    {
                        name: 'Admin Token',
                        value: 'adminToken',
                    },
                ],
                default: 'instanceToken',
                description: 'Select how to authenticate with FZAP',
            },
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: '',
                placeholder: 'https://your-fzap-instance.com',
                required: true,
                description: 'The base URL of your FZAP instance',
            },
            {
                displayName: 'Token',
                name: 'token',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: true,
                description: 'Your FZAP user token (for instance access)',
                displayOptions: {
                    show: {
                        authType: ['instanceToken'],
                    },
                },
            },
            {
                displayName: 'Admin Token',
                name: 'adminToken',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: true,
                description: 'Admin token for administrative operations',
                displayOptions: {
                    show: {
                        authType: ['adminToken'],
                    },
                },
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    token: '={{$credentials.authType === "instanceToken" ? $credentials.token : undefined}}',
                    Authorization: '={{$credentials.authType === "adminToken" ? $credentials.adminToken : undefined}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.baseUrl}}',
                url: '={{$credentials.authType === "adminToken" ? "/admin/users" : "/session/status"}}',
                method: 'GET',
                headers: {
                    token: '={{$credentials.authType === "instanceToken" ? $credentials.token : undefined}}',
                    Authorization: '={{$credentials.authType === "adminToken" ? $credentials.adminToken : undefined}}',
                },
            },
        };
    }
}
exports.FZapApi = FZapApi;
//# sourceMappingURL=FZapApi.credentials.js.map