(function() {
  let thee

  let app = new Vue({
    el: '#app',
    data() {
      return {
        files: null,
        playerElement: null,
        selectedFileIndex: null,
        isLoading: false,
        playableFile: '',
        duration: 0,
        playingtimeElem: null,
        isPlaying: false
      }
    },

    mounted () {
      thee = this

      this.playerElement = document.getElementById('player')

      this.playerElement.addEventListener('play', this.onPlay)
      this.playerElement.addEventListener('ended', this.onEnded)
      this.playerElement.addEventListener('timeupdate', this.onTimeupdate)
    },

    methods: {
      onChange(event) {
        this.selectedFileIndex = null
        this.files = event.target.files
      },

      playAudio(index) {
        this.isPlaying = true
        if (index === this.selectedFileIndex) {
          this.playerElement.play()
        } else {
          this.selectedFileIndex = index
          this.duration = 0
          
          let reader = new FileReader()

          reader.readAsDataURL(this.files[index])

          ID3.loadTags(thee.files[0].name, function() {
            let tags = ID3.getAllTags(thee.files[0].name)
            console.log(tags)
          }, {
            tags: ["TPE1", "TALB", "TDRC", "TLEN"],
            dataReader: ID3.FileAPIReader(thee.files[0])
          });
  
          reader.onloadstart = function(ev) {
            thee.isLoading = true
          }

          reader.onloadend = function(ev) {
            thee.playableFile = ''
            setTimeout(function() {
              thee.isLoading = false
              thee.playableFile = ev.target.result
            }, 50)
          }
        }
      },

      pauseAudio(index) {
        this.playerElement.pause()
        this.isPlaying = false
      },

      checkSelectFile(index) {
        return index === this.selectedFileIndex
      },

      onPlay() {
        this.playingtimeElem = document.getElementById('playingtime')
        this.duration = this.playerElement.duration
      },

      onEnded(ev) {
        thee.selectedFileIndex = null
        thee.playableFile = ''
        thee.duration = 0
        thee.isPlaying = false
      },
      
      onTimeupdate() {
        if (this.playingtimeElem) {
          const currentProc = this.playerElement.currentTime / this.duration * 100
          document.getElementById('playingtime').style.width = `${currentProc}%`
        }
      },

      showDuration() {
        let minutes = Math.floor(this.duration / 60)
        let seconds = Math.floor(this.duration % 60)
        let minutesStr = (minutes < 10) ? `0${minutes}` : `${minutes}`
        let secondsStr = (seconds < 10) ? `0${seconds}` : `${seconds}`
        return `${minutesStr} : ${secondsStr}`
      }
    }
  })
})();