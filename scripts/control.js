/* jshint esnext: true */
/* globals module */
/* globals define */
/* globals lexaudio  */
(function(lexaudio) {
  'use strict';

  var recorder, audioRecorder;

  /**
   * Represents an audio control that can start and stop recording, 
   * export captured audio, play an audio buffer, and check if audio 
   * is supported.
   */
  lexaudio.audioControl = function() {

    /**
     * This callback type is called `onSilenceCallback`.
     *
     * @callback onSilenceCallback
     */

    /**
     * Visualize callback: `visualizerCallback`.
     *
     * @callback visualizerCallback
     * @param {Uint8Array} dataArray
     * @param {number} bufferLength
     */

    /**
     * Clears the previous buffer and starts buffering audio.
     * @param {?onSilenceCallback} onSilence - Called when silence is detected.
     * @param {?visualizerCallback} visualizer - Can be used to visualize the captured buffer.
     */
    var startRecording = function(onSilence, visualizer) {
      recorder = audioRecorder.createRecorder();
      recorder.record(onSilence, visualizer);
    };

    /**
     * Stops buffering audio.
     */
    var stopRecording = function() {
      recorder.stop();
    };

    /**
     * On export complete callback: `onExportComplete`.
     *
     * @callback onExportComplete
     * @param {Blob} blob The exported audio as a Blob.
     */

    /**
     * Exports the captured audio buffer.
     * @param {onExportComplete} callback - Called when the export is complete.
     */
    var exportWAV = function(callback) {
      recorder.exportWAV(function(blob) {
        callback(blob);
      });
    };

    /**
     * On playback complete callback: `onPlaybackComplete`.
     *
     * @callback onPlaybackComplete
     */

    /**
     * Plays the audio buffer with an HTML5 audio tag. 
     * @param {Uint8Array} buffer - The audio buffer to play.
     * @param {?onPlaybackComplete} callback - Called when audio playback is complete.
     */
    var play = function(buffer, callback) {
      var myBlob = new Blob([buffer], { type: 'audio/mpeg' });
      var audio = document.createElement('audio');
      var objectUrl = window.URL.createObjectURL(myBlob);
      audio.src = objectUrl;
      audio.addEventListener('ended', function() {
        audio.currentTime = 0;
        if (typeof callback === 'function') {
          callback();
        }
      });
      audio.play();
      recorder.clear();
    };

    /**
     * On audio supported callback: `onAudioSupported`.
     *
     * @callback onAudioSupported
     * @param {boolean} 
     */

    /**
     * Checks that getUserMedia is supported and the user has given us access to the mic.
     * @param {onAudioSupported} callback - Called with the result.
     */
    var supportsAudio = function(callback) {
      if (navigator.mediaDevices.getUserMedia) {
        audioRecorder = lexaudio.audioRecorder();
        audioRecorder.requestDevice()
          .then(function(stream) { callback(true); })
          .catch(function(error) { callback(false); });
      } else {
        callback(false);
      }
    };
    return {
      startRecording: startRecording,
      stopRecording: stopRecording,
      exportWAV: exportWAV,
      play: play,
      supportsAudio: supportsAudio
    };
  };
})(lexaudio);