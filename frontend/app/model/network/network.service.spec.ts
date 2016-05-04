///<reference path="../../../browser.d.ts"/>

import {it, inject, beforeEachProviders, beforeEach, afterEach} from "@angular/core/testing";
import {BaseRequestOptions, Http, Response, ResponseOptions} from "@angular/http";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {provide} from "@angular/core";
import "rxjs/Rx";
import {NetworkService} from "./network.service";
import {Message} from "../../../../common/entities/Message";


describe('NetworkService', () => {

    let connection:MockConnection = null;

    let testUrl = "/test/url";
    let testData = {data: "testData"};
    let testResponse = "testResponse";
    let testResponseMessage = new Message(null, testResponse);

    beforeEachProviders(() => [
        MockBackend,
        BaseRequestOptions,
        provide(Http, {
            useFactory: (backend, options) => {
                return new Http(backend, options);
            }, deps: [MockBackend, BaseRequestOptions]
        }),
        NetworkService
    ]);

    beforeEach(inject([MockBackend], (backend) => {

        backend.connections.subscribe((c) => {
            connection = c;
            connection.mockRespond(new Response(
                new ResponseOptions(
                    {
                        body: testResponseMessage
                    }
                )));
        });
    }));

    afterEach(() => {

        expect(connection.request.url).toBe("/api"+testUrl);
    });


    it('should call GET', inject([NetworkService], (networkService) => {

        networkService.getJson(testUrl).then((res:Message<any>) => {
            expect(res.result).toBe(testResponse);
        });

    }));


    it('should call POST', inject([NetworkService, MockBackend], (networkService) => {

        networkService.postJson(testUrl, testData).then((res:Message<any>) => {
            expect(res.result).toBe(testResponse);
        });
        expect(connection.request.text()).toBe(JSON.stringify(testData));
    }));


    it('should call PUT', inject([NetworkService, MockBackend], (networkService) => {

        networkService.putJson(testUrl, testData).then((res:Message<any>) => {
            expect(res.result).toBe(testResponse);
        });

        expect(connection.request.text()).toBe(JSON.stringify(testData));

    }));


    it('should call DELETE', inject([NetworkService, MockBackend], (networkService) => {

        networkService.deleteJson(testUrl).then((res:Message<any>) => {
            expect(res.result).toBe(testResponse);
        });
    }));


});
