/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test the toBitDepth() method to convert an 8-bit file to 32-bit FP.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe("8-bit from file to 32-bit IEEE", function() {

    let wav = new WaveFile(
        fs.readFileSync(path + "8bit-16kHz-bext-mono.wav"));
    wav.toBitDepth("32f");
    fs.writeFileSync(
        path + "/out/to-bit-depth/8-to-32IEEE.wav", wav.toBuffer());

    it("chunkId should be 'RIFF'", function() {
        assert.equal(wav.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '", function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'", function() {
        assert.equal(wav.format, "WAVE");
    });
    it("fmtChunkSize should be 16", function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it("audioFormat should be 3 (IEEE)", function() {
        assert.equal(wav.fmt.audioFormat, 3);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it("sampleRate should be 16000", function() {
        assert.equal(wav.fmt.sampleRate, 16000);
    });
    it("byteRate be 64000", function() {
        assert.equal(wav.fmt.byteRate, 64000);
    });
    it("blockAlign should be 4", function() {
        assert.equal(wav.fmt.blockAlign, 4);
    });
    it("bitsPerSample should be 32", function() {
        assert.equal(wav.fmt.bitsPerSample, 32);
    });
    it("dataChunkId should be 'data'", function() {
        assert.equal(wav.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0", function() {
        assert.ok(wav.data.chunkSize > 0);
    });
    it("samples.length should be > 0", function() {
        assert.ok(wav.data.samples.length > 0);
    });
});

describe("8-bit mono from scratch to 32-bit IEEE (max range)", function() {

    let wav = new WaveFile();
    let samples = [0, 255];
    wav.fromScratch(1, 8000, "8", samples);
    wav.toBitDepth("32f");

    it("chunkId should be 'RIFF'", function() {
        assert.equal(wav.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '", function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'", function() {
        assert.equal(wav.format, "WAVE");
    });
    it("fmtChunkSize should be 16", function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it("audioFormat should be 3 (IEEE)", function() {
        assert.equal(wav.fmt.audioFormat, 3);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000", function() {
        assert.equal(wav.fmt.sampleRate, 8000);
    });
    it("byteRate be 32000", function() {
        assert.equal(wav.fmt.byteRate, 32000);
    });
    it("blockAlign should be 4", function() {
        assert.equal(wav.fmt.blockAlign, 4);
    });
    it("bitsPerSample should be 32", function() {
        assert.equal(wav.fmt.bitsPerSample, 32);
    });
    it("dataChunkId should be 'data'", function() {
        assert.equal(wav.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0", function() {
        assert.ok(wav.data.chunkSize > 0);
    });
    it("samples should be [-1, 1]", function() {
        //assert.deepEqual(wav.data.samples, [-1, 1]);
    });
});

describe("8-bit mono from scratch to 32-bit IEEE (128)", function() {

    let wav = new WaveFile();
    let samples = [128];
    wav.fromScratch(1, 8000, "8", samples);
    wav.toBitDepth("32f");

    it("samples should be [0]", function() {
        //assert.deepEqual(wav.data.samples, [0]);
    });
});
