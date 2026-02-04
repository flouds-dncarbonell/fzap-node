"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFields = exports.downloadOperations = void 0;
exports.downloadOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['download'],
            },
        },
        options: [
            {
                name: 'Get File',
                value: 'getFile',
                description: 'Download a file by token',
                action: 'Download a file',
            },
        ],
        default: 'getFile',
    },
];
exports.downloadFields = [
    {
        displayName: 'Download Token',
        name: 'downloadToken',
        type: 'string',
        typeOptions: { password: true },
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['download'],
                operation: ['getFile'],
            },
        },
    },
    {
        displayName: 'Binary Property',
        name: 'downloadBinaryProperty',
        type: 'string',
        default: 'data',
        description: 'Binary property name to store the downloaded file',
        displayOptions: {
            show: {
                resource: ['download'],
                operation: ['getFile'],
            },
        },
    },
];
//# sourceMappingURL=DownloadDescription.js.map