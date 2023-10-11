/* tslint:disable */
/* eslint-disable */
/**
 * Polar API
 *  Welcome to the **Polar API** for [polar.sh](https://polar.sh).  The Public API is currently a [work in progress](https://github.com/polarsource/polar/issues/834) and is in active development. 🚀  #### Authentication  Use a [Personal Access Token](https://polar.sh/settings) and send it in the `Authorization` header on the format `Bearer [YOUR_TOKEN]`.  #### Feedback  If you have any feedback or comments, reach out in the [Polar API-issue](https://github.com/polarsource/polar/issues/834), or reach out on the Polar Discord server.  We\'d love to see what you\'ve built with the API and to get your thoughts on how we can make the API better!  #### Connecting  The Polar API is online at `https://api.polar.sh`. 
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface BackofficeBadgeResponse
 */
export interface BackofficeBadgeResponse {
    /**
     * 
     * @type {string}
     * @memberof BackofficeBadgeResponse
     */
    org_slug: string;
    /**
     * 
     * @type {string}
     * @memberof BackofficeBadgeResponse
     */
    repo_slug: string;
    /**
     * 
     * @type {number}
     * @memberof BackofficeBadgeResponse
     */
    issue_number: number;
    /**
     * 
     * @type {string}
     * @memberof BackofficeBadgeResponse
     */
    action: BackofficeBadgeResponseActionEnum;
    /**
     * 
     * @type {boolean}
     * @memberof BackofficeBadgeResponse
     */
    success: boolean;
}


/**
 * @export
 */
export const BackofficeBadgeResponseActionEnum = {
    EMBED: 'embed',
    REMOVE: 'remove'
} as const;
export type BackofficeBadgeResponseActionEnum = typeof BackofficeBadgeResponseActionEnum[keyof typeof BackofficeBadgeResponseActionEnum];


/**
 * Check if a given object implements the BackofficeBadgeResponse interface.
 */
export function instanceOfBackofficeBadgeResponse(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "org_slug" in value;
    isInstance = isInstance && "repo_slug" in value;
    isInstance = isInstance && "issue_number" in value;
    isInstance = isInstance && "action" in value;
    isInstance = isInstance && "success" in value;

    return isInstance;
}

export function BackofficeBadgeResponseFromJSON(json: any): BackofficeBadgeResponse {
    return BackofficeBadgeResponseFromJSONTyped(json, false);
}

export function BackofficeBadgeResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): BackofficeBadgeResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'org_slug': json['org_slug'],
        'repo_slug': json['repo_slug'],
        'issue_number': json['issue_number'],
        'action': json['action'],
        'success': json['success'],
    };
}

export function BackofficeBadgeResponseToJSON(value?: BackofficeBadgeResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'org_slug': value.org_slug,
        'repo_slug': value.repo_slug,
        'issue_number': value.issue_number,
        'action': value.action,
        'success': value.success,
    };
}

