/* tslint:disable */
/* eslint-disable */
/**
 * Red Hat Openshift SmartEvents Fleet Manager
 * The api exposed by the fleet manager of the SmartEvents service.
 *
 * The version of the OpenAPI document: 0.0.1
 * Contact: openbridge-dev@redhat.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { ProcessorResponse } from './processor-response';

/**
 * 
 * @export
 * @interface ProcessorListResponse
 */
export interface ProcessorListResponse {
    /**
     * 
     * @type {string}
     * @memberof ProcessorListResponse
     */
    'kind'?: string;
    /**
     * 
     * @type {Array<ProcessorResponse>}
     * @memberof ProcessorListResponse
     */
    'items'?: Array<ProcessorResponse>;
    /**
     * 
     * @type {number}
     * @memberof ProcessorListResponse
     */
    'page'?: number;
    /**
     * 
     * @type {number}
     * @memberof ProcessorListResponse
     */
    'size'?: number;
    /**
     * 
     * @type {number}
     * @memberof ProcessorListResponse
     */
    'total'?: number;
}

