'use strict';

const { expect } = require('chai');
const plugin = require('../../lib/library');

describe('Poll Plugin - Full Coverage', () => {

  // ----- addPollFormattingOption -----
  describe('addPollFormattingOption', () => {
    it('attaches a poll when composerData exists', () => {
      const payload = { composerData: {} };
      plugin.addPollFormattingOption(payload, () => {});
      expect(payload.composerData.poll).to.exist;
    });

    it('does not throw when composerData missing', () => {
      const payload = {};
      expect(() => plugin.addPollFormattingOption(payload, () => {})).to.not.throw();
    });

    it('handles null poll config', () => {
      const payload = { composerData: { poll: null } };
      plugin.addPollFormattingOption(payload, () => {});
      expect(payload.composerData.poll).to.be.null;
    });

    it('default poll structure has empty options', () => {
      const payload = { composerData: {} };
      plugin.addPollFormattingOption(payload, () => {});
      const poll = payload.composerData.poll;
      expect(poll.options).to.be.an('array').that.is.empty;
    });

    it('does not mutate previous poll on multiple calls', () => {
      const payload = { composerData: {} };
      plugin.addPollFormattingOption(payload, () => {});
      const firstPoll = { ...payload.composerData.poll };
      plugin.addPollFormattingOption(payload, () => {});
      expect(payload.composerData.poll).to.deep.equal(firstPoll);
    });
  });

  // ----- hypothetical other functions -----
  describe('Other functions', () => {
    // If your library.js has other exported functions, call them with dummy data here
    // Example:
    if (plugin.validatePoll) {
      it('validatePoll returns true for valid poll', () => {
        const poll = { options: ['a', 'b'], votes: [] };
        expect(plugin.validatePoll(poll)).to.be.true;
      });

      it('validatePoll returns false for invalid poll', () => {
        const poll = { options: [], votes: [] };
        expect(plugin.validatePoll(poll)).to.be.false;
      });
    }
  });

});
