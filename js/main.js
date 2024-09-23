console.log('Lets Write Js')

// SHOW MENUS ON MOBILE DEVICES
document.querySelector('.hamburger').addEventListener('click', ()=>{
    document.querySelector('.left').style.left = '0'
    document.querySelector('.left').style.width = '95vw'
})

// SHOW MENUS ON MOBILE DEVICES
document.querySelector('.close').addEventListener('click', ()=>{
    document.querySelector('.left').style.left = '-100%'
    document.querySelector('.left').style.width = '0'
})



//SECONDS TO MINTUES SECOND FUNCTION

function secondToMintuesSecond(second){
    if(isNaN(second) || second < 0){
        return'00:00'
    }else{

    const mintues =Math.floor(second / 60)
    const seconds = Math.floor(second % 60)

    const formatedMintues = String(mintues).padStart(2, '0')
    const formatedSeconds = String(seconds).padStart(2, '0')

    return `${formatedMintues}:${formatedSeconds}`

    }
}

// VOLUME CONTEX CHANGE ON MOBILE 

// const audioContext = new (window.AudioContext || window.webkitAudioContext)();


// play.addEventListener('click', () => {
//     audioContext.resume().then(() => {
//         console.log('Playback resumed successfully');
//         // Start playback of your audio here
//     }).catch(err => {
//         console.error('Error resuming audio context:', err);
//     });
// });


// document.body.addEventListener('click', () => {
//     audioContext.resume().then(() => {
//         console.log('Playback resumed successfully');
//     }).catch(err => {
//         console.error('Error resuming audio context:', err);
//     });
// });

let curruntFolder ;
let songs;
let curruntSong = new Audio();



//PLAY MUSIC FUNCTION

const playMusic = (mp3file, pause=false)=>{
    curruntSong.src = `${curruntFolder}/` + mp3file;
    if(!pause){
        curruntSong.play();
        play.src = 'img/pause.svg'

    }

    document.querySelector('.song-name').innerHTML = curruntSong.src.replaceAll('%20', ' ').split(`/`).slice(-1)

    document.querySelector('.song-currunt-time').innerHTML = '00:00 / 00:00'




}

// GET THE SONGS FROM SONG FOLDER
async function getSongs(folder) {
    curruntFolder = folder
    let a =await fetch(`${folder}`);  
    let response =await a.text()
    let b =await fetch(`${folder}/info.json`)    
    let artist =await b.json()
    console.log(artist);
    
    let div = document.createElement('div')
    div.innerHTML = response;
    let audioFiles = div.getElementsByTagName('a');
    songs = []
    for (let index = 0; index < audioFiles.length; index++) {
        const element = audioFiles[index];
        if(element.href.includes('.mp3')){
            songs.push(element.href.replaceAll('%20', ' ').split(`/${folder}/`).slice(-1));
            
        }   
    }

    // SHOW SONGS IN THE MUSIC LIBRARY

    let songUl = document.querySelector('.song-list').getElementsByTagName('ul')[0];
    songUl.innerHTML = '';


    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + ` <li class="radius">
                <div class="song-list-top">
                  <img src="./img/music.svg" alt="" class="invert" />
                  <div class="info">
                    <h4>${song}</h4>
                    <span>${artist.Artist}</span>
                  </div>
                </div>

                <div class="song-list-bottom">
                    <h4>Play Now</h4>
                    <img src="./img/play.svg" alt="" class="invert">
                </div>
              </li>`;
                
    }


    // ATTACH AN EVENT LISTENER TO EACH  SONG
    Array.from(document.querySelector('.song-list').getElementsByTagName('li')).forEach(e=>{
        e.addEventListener('click', ()=>{
            let SongToPlay = e.querySelector('.info').firstElementChild.innerHTML;

            playMusic(SongToPlay);
            
        })
    })

    // DISPLAY ALBUM
    
}

// DISPLAY ALBUM 
async function displayAlbum() {
    let a =await fetch('/songs/')
    let response =await a.text()
    let div = document.createElement('div')
    div.innerHTML = response;
    let anchorsInAlbum= div.getElementsByTagName('a')
    let cardContainer = document.querySelector('.playlist-container')
    for (let index = 0; index < anchorsInAlbum.length; index++) {
        const element = anchorsInAlbum[index];
        if(element.href.includes('/songs/')){
            let songFolder = element.href.split('/').slice(-1)[0];

            console.log('Song Folder ' + -songFolder);
            


            // GET META DATA OF THE FOLDER 

            let a =await fetch(`songs/${songFolder}/info.json`)
            
            let response =await a.json();
            console.log(response);
            
            cardContainer.innerHTML = cardContainer.innerHTML + `
              <div class="card" data-folder="${songFolder}">
                    <div class="card-info">
                        <img src="songs/${songFolder}/cover.jpg" alt="" width="200px" height="auto">
                        <div class="play-icon">
                            <img src="./img/play.svg" alt="" class="invert" width="15px">
                        </div>
                    </div>
                    <div class="card-data">
                        <h4>${response.title}</h4>
                        <p>${response.description}</p>
                    </div>
                </div>`
                
        }



        

    }

    // LOAD THE PLAYLIST WHEN CARD CLICKED
    
    Array.from(document.getElementsByClassName('card')).forEach(card=>{
        card.addEventListener('click', async item=>{
           console.log(item.currentTarget.dataset.folder);      
            await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

            
        })
    })
}


async function main() {

    // VOLUME IMAGE ICON

    let volumeImage = document.querySelector('.volume').getElementsByTagName('img')[0];


    await getSongs(`songs/AUR`) 

    playMusic(songs[0], true)

    await displayAlbum()



    // PLAY PAUSE EVENT

    play.addEventListener('click', ()=>{
        if(curruntSong.paused){
            curruntSong.play()
            play.src = 'img/pause.svg'
        }else{
            curruntSong.pause()
            play.src = 'img/play.svg'
        }
    })

    // PREVIOUS SONG EVCENT

    previous.addEventListener('click', () => {
        let songsArray = songs.flat();
        console.log(songsArray);

        curruntSong.pause()
        
        let index = songsArray.indexOf(curruntSong.src.replaceAll("%20", " ").split('/').slice(-1)[0]);
        console.log(index, curruntSong.src.replaceAll("%20", " ").split('/').slice(-1)[0]);
        if(index-1 >= 0){
            console.log('Playing Previous Song ' + songsArray[index-1]); 
            playMusic(songsArray[index-1])
        }else{
            console.log('No Previous Song Found');         
        }
    })

    // NEXT SONG EVCENT

    next.addEventListener('click', () => {
        curruntSong.pause()
        console.log(songs);
        
        let songsArray = songs.flat();
        let index = songsArray.indexOf(curruntSong.src.replaceAll("%20", " ").split('/').slice(-1)[0]);
        console.log(index);
        

        if((index+1) !== -1 && (index+1) < songsArray.length){
            console.log('Playing next song ' + songsArray[index+1]);   
            playMusic(songsArray[index + 1])
        }else{
            console.log('No Next Song Found');
        }
    })


    // MUTE AND VOLUME 

    document.querySelector('.range').getElementsByTagName('input')[0].addEventListener('input', e => {
        console.log(e.target.value);
        
        curruntSong.volume = e.target.value / 100;

        
        if (e.target.value == 0) {
            console.log('Muted');
            volumeImage.src = 'img/mute.svg';
        } else {
            console.log('Not Muted');
            volumeImage.src = 'img/volume.svg';
        }
    });

    volumeImage.addEventListener('click', e=>{
        console.log('Volume is clicked');
        console.log(e.target.src);
        
        if(e.target.src.includes('volume.svg')){
            e.target.src = e.target.src.replace('volume.svg', 'mute.svg')
            curruntSong.volume = '0'
            document.querySelector('.range').getElementsByTagName('input')[0].value = '0'
        }else{

            e.target.src = e.target.src.replace('mute.svg', 'volume.svg');
            curruntSong.volume = '.5'
            document.querySelector('.range').getElementsByTagName('input')[0].value = '50'

        }

        
    })


    // CURRUNT SONG TIME AND DUARATION UPDATE WHEN PLAYING

    curruntSong.addEventListener('timeupdate', ()=>{
        document.querySelector('.song-currunt-time').innerHTML = `${secondToMintuesSecond(curruntSong.currentTime)} / ${secondToMintuesSecond(curruntSong.duration)}`
        document.querySelector('.circle').style.left = (curruntSong.currentTime/curruntSong.duration)*100 + '%'    
    })

    
    // SEEKBAR 

    document.querySelector('.seekbar').addEventListener('click', e=>{
        let percentClick = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        
        document.querySelector('.circle').style.left = percentClick + '%'
        curruntSong.currentTime = (curruntSong.duration * percentClick)/100
        
        
    })



}



main()