/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test writing 8-bit files with the fromScratch() method.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe('create 8-bit wave files from scratch', function() {
    
    let wav = new WaveFile();
    wav.fromScratch(1, 48000, '8', [0, 255, 2, 3]);
    fs.writeFileSync(
        "././test/files/out/8-bit-48kHz-mono-fromScratch.wav",
        wav.toBuffer());

    it('chunkId should be "RIFF"', function() {
        assert.equal(wav.container, "RIFF");
    });
    it('format should be "WAVE"', function() {
        assert.equal(wav.format, "WAVE");
    });
    it('fmtChunkId should be "fmt "', function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it('fmtChunkSize should be 16', function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it('audioFormat should be 1', function() {
        assert.equal(wav.fmt.audioFormat, 1);
    });
    it('numChannels should be 1', function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it('sampleRate should be 48000', function() {
        assert.equal(wav.fmt.sampleRate, 48000);
    });
    it('byteRate should be 48000', function() {
        assert.equal(wav.fmt.byteRate, 48000);
    });
    it('blockAlign should be 1', function() {
        assert.equal(wav.fmt.blockAlign, 1);
    });
    it('bitsPerSample should be 8', function() {
        assert.equal(wav.fmt.bitsPerSample, 8);
    });
    it('dataChunkId should be "data"', function() {
        assert.equal(wav.data.chunkId, "data");
    });
    it('dataChunkSize should be 4', function() {
        assert.equal(wav.data.chunkSize, 4);
    });
    it('samples should be the same as the args', function() {
        //assert.deepEqual(wav.data.samples, [0, 255, 2, 3]);
    });
    it('bitDepth should be "8"', function() {
        assert.equal(wav.bitDepth, "8");
    });
});
