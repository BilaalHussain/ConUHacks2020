var infStream = require('./InfUtils.js');

var infiniteStream = infStream.infiniteStream;
require(`yargs`)
  .demand(1)
  .command(
    `infiniteStream`,
    `infinitely streams audio input from microphone to speech API`,
    {},
    opts =>
      infiniteStream(
        opts.encoding,
        opts.sampleRateHertz,
        opts.languageCode,
        opts.streamingLimit
      )
  )
  .options({
    encoding: {
      alias: 'e',
      default: 'LINEAR16',
      global: true,
      requiresArg: true,
      type: 'string',
    },
    sampleRateHertz: {
      alias: 'r',
      default: 16000,
      global: true,
      requiresArg: true,
      type: 'number',
    },
    languageCode: {
      alias: 'l',
      default: 'en-US',
      global: true,
      requiresArg: true,
      type: 'string',
    },
    streamingLimit: {
      alias: 's',
      default: 290000,
      global: true,
      requiresArg: true,
      type: 'number',
    },
  })
  .example(`node $0 infiniteStream`)
  .wrap(120)
  .recommendCommands()
  .epilogue(`For more information, see https://cloud.google.com/speech/docs`)
  .help()
  .strict().argv;
