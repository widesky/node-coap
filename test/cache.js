/*
 * Copyright (c) 2013-2020 node-coap contributors.
 *
 * node-coap is licensed under an MIT +no-false-attribs license.
 * All rights not explicitly granted in the MIT license are reserved.
 * See the included LICENSE file for more details.
 */

const { expect } = require('chai');
const BlockCache = require('../lib/cache');

describe('Cache', () => {
    describe('Block Cache', () => {
        it('Should set up empty cache object', (done) => {
            let b = new BlockCache();
            expect(b._cache).to.eql({});
            setImmediate(done);
        })
    })

    describe('Reset', () => {
        it('Should reset all caches', (done) => {
            let b = new BlockCache(10000, () => { return null});
            b.add('test', {payload: 'test'});
            b.reset();
            expect(b._cache).to.eql({});
            setImmediate(done);
        })
    })

    describe('Add', () => {
        it('Should add to cache', (done) => {
            let b = new BlockCache(10000, () => { return null});
            b.add('test', {payload: 'test'});
            expect(b._cache).to.have.own.property('test');
            setImmediate(done);
        })
        // reuse old cache entry
    })

    describe('Remove', () => {
        it('Should from cache', (done) => {
            let b = new BlockCache(10000, () => { return null});
            b.add('test', {payload: 'test'});
            b.add('test2', {payload: 'test2'});
            b.remove('test');
            expect(b._cache).to.not.have.own.property('test');
            setImmediate(done);
        })
    })

    describe('Contains', () => {
        it('Should check if value exists & return true', (done) => {
            let b = new BlockCache(10000, () => { return null});
            b.add('test', {payload: 'test'});
            expect(b.contains('test')).to.eql(true);
            setImmediate(done);
        })

        it('Should check if value exists & return false', (done) => {
            let b = new BlockCache(10000, () => { return null});
            b.add('test', {payload: 'test'});
            expect(b.contains('test2')).to.eql(false);
            setImmediate(done);
        })
    })

    describe('Get', () => {
        it('Should return payload from cache', (done) => {
            let b = new BlockCache(10000, () => { return null});
            b.add('test', {payload: 'test'});
            expect(b.get('test')).to.eql({payload: 'test'});
            setImmediate(done);
        })
    })

    describe('Get Witgh Default Insert', () => {
        it('Should return payload from cache if it exists', (done) => {
            let b = new BlockCache(10000, () => { return null});
            b.add('test', {payload: 'test'});
            expect(b.getWithDefaultInsert('test')).to.eql({payload: 'test'});
            setImmediate(done);
        })

        it('Should add to cache if it doesnt exist', (done) => {
            let b = new BlockCache(10000, () => { return null});
            b.getWithDefaultInsert('test');
            expect(b._cache).to.have.own.property('test');
            setImmediate(done);
        })
    })
})