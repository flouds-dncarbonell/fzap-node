"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.folderFields = exports.folderOperations = void 0;
exports.folderOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['folder'],
            },
        },
        options: [
            {
                name: 'Create Instance',
                value: 'createInstance',
                description: 'Create an instance in a folder',
                action: 'Create folder instance',
            },
            {
                name: 'Delete Instance',
                value: 'deleteInstance',
                description: 'Remove instance from folder',
                action: 'Delete folder instance',
            },
            {
                name: 'Delete Instance (Full)',
                value: 'deleteInstanceFull',
                description: 'Delete instance completely',
                action: 'Delete folder instance fully',
            },
            {
                name: 'List Instances',
                value: 'listInstances',
                description: 'List instances in folders',
                action: 'List folder instances',
            },
        ],
        default: 'listInstances',
    },
];
exports.folderFields = [
    {
        displayName: 'Instance ID',
        name: 'folderInstanceId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['folder'],
                operation: ['deleteInstance', 'deleteInstanceFull'],
            },
        },
    },
    {
        displayName: 'Instance Data (JSON)',
        name: 'folderInstanceData',
        type: 'string',
        typeOptions: {
            rows: 4,
        },
        required: true,
        default: '',
        description: 'JSON payload for creating a folder instance',
        displayOptions: {
            show: {
                resource: ['folder'],
                operation: ['createInstance'],
            },
        },
    },
];
//# sourceMappingURL=FolderDescription.js.map