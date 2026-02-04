"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterFields = exports.newsletterOperations = void 0;
exports.newsletterOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['newsletter'],
            },
        },
        options: [
            {
                name: 'List',
                value: 'list',
                description: 'List subscribed newsletters',
                action: 'List newsletters',
            },
        ],
        default: 'list',
    },
];
exports.newsletterFields = [];
//# sourceMappingURL=NewsletterDescription.js.map