var htmlWriter = require("innerhtml");



module.exports = {

    bindTextOstream: (tmpOut, mainOut) => {





        const chalk = require('chalk');
        const {Transform} = require('stream');

        // Node-Record-lpcm16
        const recorder = require('node-record-lpcm16');

        // Imports the Google Cloud client library
        // Currently, only v1p1beta1 contains result-end-time
        const speech = require('@google-cloud/speech').v1p1beta1;

        const client = new speech.SpeechClient();

        const config = {
            encoding: encoding,
            sampleRateHertz: sampleRateHertz,
            languageCode: languageCode,
        };

        const request = {
            config,
            interimResults: true,
        };

        let recognizeStream = null;
        let restartCounter = 0;
        let audioInput = [];
        let lastAudioInput = [];
        let resultEndTime = 0;
        let isFinalEndTime = 0;
        let finalRequestEndTime = 0;
        let newStream = true;
        let bridgingOffset = 0;
        let lastTranscriptWasFinal = false;
        let lastTranscripWasFinal = false;




        //INIT MAIn
        //Init google stream
        audioInput = [];
        // Initiate (Reinitiate) a recognize stream
        recognizeStream = client
            .streamingRecognize(request)
            .on('error', err => {
                if (err.code === 11) {
                    console.log("Error code 11!")
                    // restartStream();
                } else {
                    console.error('API request error ' + err);
                }
            })
            .on('data', speechCallback);

        // Restart stream when streamingLimit expires
        setTimeout(restartStream, streamingLimit);
        //End Init google stream

        //END INIT MAIN


        htmlWriter.createWriteStream(mainOut);

        speechCallback = (stream) => {
            resultEndTime =
                stream.results[0].resultEndTime.seconds * 1000 +
                Math.round(stream.results[0].resultEndTime.nanos / 1000000);

            // Calculate correct time based on offset from audio sent twice
            const correctedTime =
                  resultEndTime - bridgingOffset + streamingLimit * restartCounter;
                        if (stream.results[0] && stream.results[0].alternatives[0]) {
                            stdoutText = correctedTime + ': ' + stream.results[0].alternatives[0].transcript;

            }
            if (stream.results[0].isFinal) {
                htmlWriter.write(stdoutText);
                isFinalEndTime = resultEndTime;
                lastTranscriptWasFinal = true;
            } else {
                // Make sure transcript does not exceed console character length
                if (stdoutText.length > process.stdout.columns) {
                    stdoutText =
                        stdoutText.substring(0, process.stdout.columns - 4) + '...';
                }
                //process.stdout.write(chalk.red(`${stdoutText}`));

                lastTranscriptWasFinal = false;
            }

        };







    }
};
