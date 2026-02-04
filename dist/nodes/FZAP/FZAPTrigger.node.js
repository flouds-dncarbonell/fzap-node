"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FZAPTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
async function assertConnectedInstanceToken(baseUrl, adminToken, instanceToken) {
    const options = {
        method: 'GET',
        url: `${baseUrl}/admin/users`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: adminToken,
        },
    };
    const response = (await this.helpers.httpRequest(options));
    const data = response.data || [];
    const selected = data.find((user) => { var _a; return String((_a = user.token) !== null && _a !== void 0 ? _a : '') === instanceToken; });
    if (!selected) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
            message: 'Selected instance token was not found',
            description: 'Verify the Instance selection or refresh the list of instances',
        });
    }
    if (!selected.connected) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
            message: 'Selected instance is not connected',
            description: 'Only connected instances can be used',
        });
    }
}
async function getTriggerAuth() {
    const credentials = await this.getCredentials('fZapApi');
    const baseUrl = credentials.baseUrl.replace(/\/$/, '');
    const authType = credentials.authType;
    const accessMode = this.getNodeParameter('accessMode', 0);
    if (accessMode === 'admin' && authType !== 'adminToken') {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
            message: 'Access Mode is Admin but the credentials use Instance Token',
            description: 'Switch the credential to Admin Token or set Access Mode to Instance',
        });
    }
    if (accessMode === 'instance' && authType === 'adminToken') {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
            message: 'Access Mode is Instance but the credentials use Admin Token',
            description: 'Switch the credential to Instance Token or set Access Mode to Admin',
        });
    }
    if (authType === 'adminToken') {
        const adminToken = credentials.adminToken;
        if (!adminToken) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                message: 'Admin token is required when using Admin authentication',
                description: 'Please configure the Admin Token in your FZAP credentials',
            });
        }
        const instanceToken = this.getNodeParameter('instanceToken', 0);
        if (!instanceToken) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                message: 'Instance token is required when using Admin authentication',
                description: 'Set the Instance Token field to select which instance to use',
            });
        }
        await assertConnectedInstanceToken.call(this, baseUrl, adminToken, instanceToken);
        return { baseUrl, token: instanceToken };
    }
    const token = credentials.token;
    if (!token) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
            message: 'Instance token is required when using Instance authentication',
            description: 'Please configure the Token in your FZAP credentials',
        });
    }
    return { baseUrl, token };
}
class FZAPTrigger {
    constructor() {
        this.description = {
            displayName: 'FZAP Trigger',
            name: 'fzapTrigger',
            icon: 'file:fzap.svg',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["events"].join(", ")}}',
            description: 'Receive WhatsApp events from FZAP',
            defaults: {
                name: 'FZAP Trigger',
            },
            inputs: [],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            credentials: [
                {
                    name: 'fZapApi',
                    required: true,
                },
            ],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'webhook',
                },
            ],
            properties: [
                {
                    displayName: 'Access Mode',
                    name: 'accessMode',
                    type: 'options',
                    options: [
                        {
                            name: 'Instance (Use Credential Token)',
                            value: 'instance',
                        },
                        {
                            name: 'Admin (Select Instance)',
                            value: 'admin',
                        },
                    ],
                    default: 'instance',
                    description: 'Choose how to select the instance for the trigger',
                },
                {
                    displayName: 'Instance Name or ID',
                    name: 'instanceToken',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getInstances',
                    },
                    allowArbitraryValues: true,
                    required: true,
                    default: '',
                    description: 'Instance token to use when authenticating with Admin Token (offline instances are marked). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
                    displayOptions: {
                        show: {
                            accessMode: ['admin'],
                        },
                    },
                },
                {
                    displayName: 'Events',
                    name: 'events',
                    type: 'multiOptions',
                    required: true,
                    default: ['Message'],
                    description: 'WhatsApp events to listen for',
                    options: [
                        { name: 'All', value: 'All' },
                        { name: 'Message', value: 'Message' },
                        { name: 'Automation Message', value: 'AutomationMessage' },
                        { name: 'Undecryptable Message', value: 'UndecryptableMessage' },
                        { name: 'Receipt', value: 'Receipt' },
                        { name: 'Media Retry', value: 'MediaRetry' },
                        { name: 'Read Receipt', value: 'ReadReceipt' },
                        { name: 'Group Info', value: 'GroupInfo' },
                        { name: 'Joined Group', value: 'JoinedGroup' },
                        { name: 'Picture', value: 'Picture' },
                        { name: 'Blocklist Change', value: 'BlocklistChange' },
                        { name: 'Blocklist', value: 'Blocklist' },
                        { name: 'Connected', value: 'Connected' },
                        { name: 'Disconnected', value: 'Disconnected' },
                        { name: 'Connect Failure', value: 'ConnectFailure' },
                        { name: 'Keep Alive Restored', value: 'KeepAliveRestored' },
                        { name: 'Keep Alive Timeout', value: 'KeepAliveTimeout' },
                        { name: 'Logged Out', value: 'LoggedOut' },
                        { name: 'Presence', value: 'Presence' },
                        { name: 'Chat Presence', value: 'ChatPresence' },
                        { name: 'Call Offer', value: 'CallOffer' },
                        { name: 'Call Accept', value: 'CallAccept' },
                        { name: 'Call Terminate', value: 'CallTerminate' },
                        { name: 'Call Offer Notice', value: 'CallOfferNotice' },
                        { name: 'Call Relay Latency', value: 'CallRelayLatency' },
                        { name: 'App State', value: 'AppState' },
                        { name: 'App State Sync Complete', value: 'AppStateSyncComplete' },
                        { name: 'History Sync', value: 'HistorySync' },
                        { name: 'Offline Sync Completed', value: 'OfflineSyncCompleted' },
                        { name: 'Offline Sync Preview', value: 'OfflineSyncPreview' },
                        { name: 'Privacy Settings', value: 'PrivacySettings' },
                        { name: 'Push Name Setting', value: 'PushNameSetting' },
                        { name: 'User About', value: 'UserAbout' },
                        { name: 'Newsletter Join', value: 'NewsletterJoin' },
                        { name: 'Newsletter Leave', value: 'NewsletterLeave' },
                        { name: 'Newsletter Mute Change', value: 'NewsletterMuteChange' },
                        { name: 'Newsletter Live Update', value: 'NewsletterLiveUpdate' },
                        { name: 'Identity Change', value: 'IdentityChange' },
                        { name: 'CAT Refresh Error', value: 'CATRefreshError' },
                        { name: 'FB Message', value: 'FBMessage' },
                        { name: 'QR', value: 'QR' },
                        { name: 'Pair Success', value: 'PairSuccess' },
                        { name: 'Pair Error', value: 'PairError' },
                    ],
                },
            ],
            usableAsTool: true,
        };
        this.methods = {
            loadOptions: {
                async getInstances() {
                    return GenericFunctions_1.getFzapInstanceOptions.call(this);
                },
            },
        };
        this.webhookMethods = {
            default: {
                async checkExists() {
                    const webhookData = this.getWorkflowStaticData('node');
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    if (webhookData.webhookId === undefined) {
                        return false;
                    }
                    try {
                        const { baseUrl, token } = await getTriggerAuth.call(this);
                        const options = {
                            method: 'GET',
                            url: `${baseUrl}/webhook`,
                            headers: {
                                'Content-Type': 'application/json',
                                token,
                            },
                        };
                        const response = (await this.helpers.httpRequest(options));
                        const webhooks = response.data || [];
                        for (const webhook of webhooks) {
                            if (webhook.id === webhookData.webhookId && webhook.url === webhookUrl) {
                                return true;
                            }
                        }
                    }
                    catch {
                    }
                    delete webhookData.webhookId;
                    return false;
                },
                async create() {
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    const events = this.getNodeParameter('events');
                    const webhookData = this.getWorkflowStaticData('node');
                    if (!webhookUrl) {
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                            message: 'Webhook URL is undefined',
                            description: 'Could not get the webhook URL. Please try again.',
                        });
                    }
                    if (webhookUrl.includes('localhost')) {
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                            message: 'Webhook URL cannot be localhost',
                            description: 'The FZAP API needs a publicly accessible URL. Use a tunnel service like ngrok for testing.',
                        });
                    }
                    const { baseUrl, token } = await getTriggerAuth.call(this);
                    const body = {
                        url: webhookUrl,
                        events,
                    };
                    const options = {
                        method: 'POST',
                        url: `${baseUrl}/webhook`,
                        headers: {
                            'Content-Type': 'application/json',
                            token,
                        },
                        body: JSON.stringify(body),
                    };
                    const response = (await this.helpers.httpRequest(options));
                    if (!response.success) {
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                            message: 'Failed to create webhook',
                            description: JSON.stringify(response),
                        });
                    }
                    const data = response.data;
                    webhookData.webhookId = data.id;
                    return true;
                },
                async delete() {
                    const webhookData = this.getWorkflowStaticData('node');
                    if (webhookData.webhookId === undefined) {
                        return true;
                    }
                    try {
                        const { baseUrl, token } = await getTriggerAuth.call(this);
                        const options = {
                            method: 'DELETE',
                            url: `${baseUrl}/webhook/${webhookData.webhookId}`,
                            headers: {
                                'Content-Type': 'application/json',
                                token,
                            },
                        };
                        await this.helpers.httpRequest(options);
                    }
                    catch {
                    }
                    delete webhookData.webhookId;
                    return true;
                },
            },
        };
    }
    async webhook() {
        const bodyData = this.getBodyData();
        return {
            workflowData: [this.helpers.returnJsonArray(bodyData)],
        };
    }
}
exports.FZAPTrigger = FZAPTrigger;
//# sourceMappingURL=FZAPTrigger.node.js.map