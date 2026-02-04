"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFzapInstanceOptions = getFzapInstanceOptions;
exports.fzapApiRequest = fzapApiRequest;
exports.fzapAdminApiRequest = fzapAdminApiRequest;
const n8n_workflow_1 = require("n8n-workflow");
async function fetchAdminInstances(baseUrl, adminToken) {
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
    return data.map((user) => {
        var _a, _b, _c, _d;
        return ({
            name: String((_c = (_b = (_a = user.name) !== null && _a !== void 0 ? _a : user.id) !== null && _b !== void 0 ? _b : user.token) !== null && _c !== void 0 ? _c : 'Unknown'),
            token: String((_d = user.token) !== null && _d !== void 0 ? _d : ''),
            connected: Boolean(user.connected),
        });
    });
}
async function getFzapInstanceOptions() {
    const credentials = await this.getCredentials('fZapApi');
    const authType = credentials.authType;
    if (authType !== 'adminToken') {
        return [];
    }
    const adminToken = credentials.adminToken;
    if (!adminToken) {
        return [];
    }
    const baseUrl = credentials.baseUrl.replace(/\/$/, '');
    const instances = await fetchAdminInstances.call(this, baseUrl, adminToken);
    const sorted = instances.slice().sort((a, b) => {
        if (a.connected !== b.connected) {
            return a.connected ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
    });
    return sorted.map((instance) => ({
        name: instance.connected ? instance.name : `${instance.name} (offline)`,
        value: instance.token,
    }));
}
async function fzapApiRequest(method, endpoint, body = {}, query = {}, itemIndex = 0) {
    var _a, _b;
    let requestBody = {};
    let requestQuery = {};
    let resolvedItemIndex = itemIndex;
    if (typeof body === 'number') {
        resolvedItemIndex = body;
    }
    else {
        requestBody = body;
    }
    if (typeof query === 'number') {
        resolvedItemIndex = query;
    }
    else {
        requestQuery = query;
    }
    const credentials = await this.getCredentials('fZapApi');
    const authType = credentials.authType;
    const accessMode = this.getNodeParameter('accessMode', resolvedItemIndex);
    const baseUrl = credentials.baseUrl.replace(/\/$/, '');
    let token = credentials.token;
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
        const instanceToken = this.getNodeParameter('instanceToken', resolvedItemIndex);
        if (!instanceToken) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                message: 'Instance token is required when using Admin authentication',
                description: 'Set the Instance Token field to select which instance to use',
            });
        }
        const cachedInstances = this.__fzapInstances ||
            (await fetchAdminInstances.call(this, baseUrl, adminToken));
        this.__fzapInstances = cachedInstances;
        const selected = cachedInstances.find((instance) => instance.token === instanceToken);
        if (!selected) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                message: 'Selected instance token was not found',
                description: 'Verify the Instance Token or refresh the list of instances',
            });
        }
        if (!selected.connected) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                message: 'Selected instance is not connected',
                description: 'Only connected instances can be used',
            });
        }
        token = instanceToken;
    }
    else {
        if (!token) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                message: 'Instance token is required when using Instance authentication',
                description: 'Please configure the Token in your FZAP credentials',
            });
        }
    }
    const options = {
        method,
        url: `${baseUrl}${endpoint}`,
        headers: {
            'Content-Type': 'application/json',
            token,
        },
        returnFullResponse: true,
        ignoreHttpStatusErrors: true,
    };
    if (Object.keys(requestBody).length > 0) {
        options.body = JSON.stringify(requestBody);
    }
    if (Object.keys(requestQuery).length > 0) {
        options.qs = requestQuery;
    }
    const response = await this.helpers.httpRequest(options);
    if (response.statusCode >= 400) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
            message: ((_a = response.body) === null || _a === void 0 ? void 0 : _a.error) || ((_b = response.body) === null || _b === void 0 ? void 0 : _b.message) || `HTTP ${response.statusCode}`,
            description: JSON.stringify(response.body),
            httpCode: String(response.statusCode),
        });
    }
    return response.body;
}
async function fzapAdminApiRequest(method, endpoint, body = {}, query = {}) {
    var _a, _b;
    const credentials = await this.getCredentials('fZapApi');
    const authType = credentials.authType;
    if (authType !== 'adminToken') {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
            message: 'Admin authentication is required for this operation',
            description: 'Select Admin Token in your FZAP credentials',
        });
    }
    const baseUrl = credentials.baseUrl.replace(/\/$/, '');
    const adminToken = credentials.adminToken;
    if (!adminToken) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
            message: 'Admin token is required for admin operations',
            description: 'Please configure the Admin Token in your FZAP credentials',
        });
    }
    const options = {
        method,
        url: `${baseUrl}${endpoint}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: adminToken,
        },
        returnFullResponse: true,
        ignoreHttpStatusErrors: true,
    };
    if (Object.keys(body).length > 0) {
        options.body = JSON.stringify(body);
    }
    if (Object.keys(query).length > 0) {
        options.qs = query;
    }
    const response = await this.helpers.httpRequest(options);
    if (response.statusCode >= 400) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
            message: ((_a = response.body) === null || _a === void 0 ? void 0 : _a.error) || ((_b = response.body) === null || _b === void 0 ? void 0 : _b.message) || `HTTP ${response.statusCode}`,
            description: JSON.stringify(response.body),
            httpCode: String(response.statusCode),
        });
    }
    return response.body;
}
//# sourceMappingURL=GenericFunctions.js.map