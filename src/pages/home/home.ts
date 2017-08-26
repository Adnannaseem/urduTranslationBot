import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Http, Headers } from "@angular/http";

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  [x: string]: any;
  message: string;
  speechRecognition: any;
  recognizing = false;
  ignore_onend;
  start_timestamp;
  conversation: FirebaseListObservable<any[]>;
  recognition: any;
  constructor(public navCtrl: NavController, private _AngularFireDatabase: AngularFireDatabase, private http: Http) {
    this.conversation = _AngularFireDatabase.list('/conversation');
    if (!('webkitSpeechRecognition' in window)) {
      // upgrade();
    } else {
      const { webkitSpeechRecognition }: IWindow = <IWindow>window;
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.onstart = function () {
        this.recognizing = true;
      };
      this.recognition.onerror = function (event) {
        if (event.error == 'no-speech') {
          this.ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
          this.ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
          if (event.timeStamp - this.start_timestamp < 100) {
          }
          this.ignore_onend = true;
        }
      };
      this.recognition.onend = function () {
        this.recognizing = false;
        if (this.ignore_onend) {
          return;
        }
        if (!this.final_transcript) {
          return;
        }
        if (window.getSelection) {
          window.getSelection().removeAllRanges();
          var range = document.createRange();
          range.selectNode(document.getElementById('final_span'));
          window.getSelection().addRange(range);
        }
      };
      this.recognition.onresult = function (event) {
        var interim_transcript = '';
        var final_transcript = '';
        // console.log('event result: ', event.results)
        // var interim_span = document.getElementById('message')
        var final_span = document.getElementById('message')
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
            
          }
        }
        // interim_span.innerHTML = final_transcript;
        final_span.innerHTML = interim_transcript;
        this.message = final_transcript;
      };
    }
  }

  sendMessage() {
    console.log("funccccccccccccccccccc",this.message)
    let send = { name: 'You', imageUrl: '../assets/images/user.png', text: this.message }
    this._AngularFireDatabase.list('/conversation').push(send);
    // this.sendToBot()
    this.message = '';
  }

  startButton(event) {
    if (this.recognizing) {
      this.recognition.stop();
      return;
    }
    this.final_transcript = '';
    this.recognition['lang'] = "ur-PK";
    this.recognition.start();
    this.ignore_onend = false;
  }
  

}
