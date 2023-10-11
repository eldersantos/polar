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
 * @interface PledgeStripePaymentIntentCreate
 */
export interface PledgeStripePaymentIntentCreate {
    /**
     * 
     * @type {string}
     * @memberof PledgeStripePaymentIntentCreate
     */
    issue_id: string;
    /**
     * 
     * @type {string}
     * @memberof PledgeStripePaymentIntentCreate
     */
    email: string;
    /**
     * 
     * @type {number}
     * @memberof PledgeStripePaymentIntentCreate
     */
    amount: number;
    /**
     * 
     * @type {string}
     * @memberof PledgeStripePaymentIntentCreate
     */
    setup_future_usage?: PledgeStripePaymentIntentCreateSetupFutureUsageEnum;
}


/**
 * @export
 */
export const PledgeStripePaymentIntentCreateSetupFutureUsageEnum = {
    ON_SESSION: 'on_session'
} as const;
export type PledgeStripePaymentIntentCreateSetupFutureUsageEnum = typeof PledgeStripePaymentIntentCreateSetupFutureUsageEnum[keyof typeof PledgeStripePaymentIntentCreateSetupFutureUsageEnum];


/**
 * Check if a given object implements the PledgeStripePaymentIntentCreate interface.
 */
export function instanceOfPledgeStripePaymentIntentCreate(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "issue_id" in value;
    isInstance = isInstance && "email" in value;
    isInstance = isInstance && "amount" in value;

    return isInstance;
}

export function PledgeStripePaymentIntentCreateFromJSON(json: any): PledgeStripePaymentIntentCreate {
    return PledgeStripePaymentIntentCreateFromJSONTyped(json, false);
}

export function PledgeStripePaymentIntentCreateFromJSONTyped(json: any, ignoreDiscriminator: boolean): PledgeStripePaymentIntentCreate {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'issue_id': json['issue_id'],
        'email': json['email'],
        'amount': json['amount'],
        'setup_future_usage': !exists(json, 'setup_future_usage') ? undefined : json['setup_future_usage'],
    };
}

export function PledgeStripePaymentIntentCreateToJSON(value?: PledgeStripePaymentIntentCreate | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'issue_id': value.issue_id,
        'email': value.email,
        'amount': value.amount,
        'setup_future_usage': value.setup_future_usage,
    };
}

