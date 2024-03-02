import { LinkedList } from "../models/LinkedList.mjs"
import {AudioView} from "../models/AudioView.js"

class index {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.bindTogglePlay(this.togglePlay.bind(this));
    this.view.bindChangeSong(this.changeSong.bind(this));
    this.view.bindUpdateProgressBar(this.updateProgressBar.bind(this));
    this.view.bindSetProgress(this.setProgress.bind(this));
    this.loadAudio(this.model.playlist.getCurrentSong());
  }

  loadAudio(song) {
    this.model.audio.src = `audio/${song}.mp3`;
    this.view.setTitle(song);
    this.updateProgressBar();
  }

  togglePlay() {
    if (this.model.audio.paused) {
      this.model.audio.play();
    } else {
      this.model.audio.pause();
    }
  }

  changeSong(direction) {
    const nextSong = direction === 1 ? this.model.playlist.getNextSong() : this.model.playlist.getPrevSong();
    if (nextSong) {
      this.loadAudio(nextSong);
    }
  }

  updateProgressBar() {
    const duration = this.model.audio.duration;
    const currentTime = this.model.audio.currentTime;
    const progressPercent = (currentTime / duration) * 100;
    this.view.setProgress(progressPercent);
    this.view.setCurrentTime(this.formatTime(currentTime));
  }

  setProgress(event) {
    const { clientWidth } = this.view.progressContainer;
    const clickPosition = event.offsetX;
    this.model.audio.currentTime = (clickPosition / clientWidth) * this.model.audio.duration;
  }

  formatTime(time) {
    const totalSeconds = Math.round(time);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}
const playlist = new LinkedList();
playlist.add("a");
playlist.add("b");
playlist.add("c");
playlist.add("d");
playlist.add("e");
playlist.add("f");

const audioElement = document.querySelector("audio");
const model = { audio: audioElement, playlist };
const view = new AudioView(audioElement);

const controller = new index(model, view);
